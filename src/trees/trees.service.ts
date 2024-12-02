import { CrudRequest } from '@dataui/crud';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tree } from './entities/tree.entity';
import {
  plantingTypeMapping,
  SellStatus,
  sellStatusMapping,
} from './tree.interface';
import { Garden } from '../gardens/entities/garden.entity';

@Injectable()
export class TreesService extends TypeOrmCrudService<Tree> {
  constructor(
    @InjectRepository(Tree) public repo: Repository<Tree>,
    @InjectRepository(Garden) public gardenRepo: Repository<Garden>,
  ) {
    super(repo);
  }

  async getTree(id: string) {
    const tree = await this.repo.findOne({
      where: { id },
      relations: {
        garden: { owner: true }, // Load garden and owner in one query
        variety: true,
      },
      select: {
        id: true,
        name: true,
        kind: true,
        variety: {
          name: true,
          id: true,
          description: true,
        },
        yearPlanted: true,
        sellStatus: true,
        price: true,
        garden: {
          id: true,
          name: true,
          kind: true,
          variety: true,
          areaUnit: true,
          areaSize: true,
          owner: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tree) {
      throw new BadRequestException('Tree not found');
    }

    // Remove gardener from the garden object (if needed)
    if (tree.garden) {
      const { owner, ...gardenWithoutGardener } = tree.garden;
      tree.garden = gardenWithoutGardener as any;
      tree.owner = owner; // Assign owner at the tree level
    }

    return tree;
  }

  async getManyTrees(req: CrudRequest) {
    const { limit, offset, page, sort, filter } = req.parsed;

    // const trees = await this.repo.find({
    //   relations: {
    //     garden: {
    //       gardener: true,
    //     },
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     kind: true,
    //     variety: true,
    //     description: true,
    //     growingArea: true,
    //     yearPlanted: true,
    //     sellStatus: true,
    //     price: true,
    //     garden: {
    //       id: true,
    //       name: true,
    //       location: true,
    //       kind: true,
    //       variety: true,
    //       unitArea: true,
    //       plantingArea: true,
    //       gardener: {
    //         id: true,
    //         name: true,
    //         email: true,
    //       },
    //     },
    //   },
    // });
    const query = await this.repo
      .createQueryBuilder('tree')
      .leftJoinAndSelect('tree.garden', 'garden')
      .leftJoinAndSelect('tree.variety', 'variety')
      .leftJoinAndSelect('garden.owner', 'owner')
      .select([
        'tree.id',
        'tree.name',
        'tree.kind',
        'variety.name',
        'variety.description',
        'variety.taste',
        'variety.origin',
        'variety.minWeight',
        'variety.maxWeight',
        'tree.yearPlanted',
        'tree.sellStatus',
        'tree.price',
        'tree.coordinates',
        'tree.expectedOutput',
        'tree.expectedFruitingTime',
        'tree.ownershipPeriod',
        'tree.hasCamera',
        'tree.plantingType',
        'tree.annualOutput',
        'garden.id',
        'garden.name',
        'garden.kind',
        'garden.variety',
        'garden.areaUnit',
        'garden.areaSize',
        'owner.id',
        'owner.name',
        'owner.email',
      ]);
    if (limit) {
      query.limit(limit);
    }
    if (offset && page) {
      query.offset(offset || (page - 1) * limit);
    }
    if (sort && sort.length > 0) {
      for (const sortOrder of sort) {
        query.orderBy(`trees."${sortOrder.field}"`, sortOrder.order);
      }
    }

    if (filter && filter.length > 0) {
      for (const filterField of filter) {
        if (filterField.field.includes('.')) {
          query.andWhere(`${filterField.field} = :value`, {
            value: filterField.value,
          });
        } else {
          query.andWhere(`tree."${filterField.field}" ILIKE :appName`, {
            appName: `%${filterField.value}%`,
          });
        }
      }
    }
    const trees = await query.getMany();
    const total = await query.getCount();
    trees.forEach((tree) => {
      if (tree.garden) {
        const { owner, ...gardenWithoutGardener } = tree.garden;
        tree.garden = gardenWithoutGardener as any;
        tree.owner = owner;
      }
    });

    return {
      count: trees.length,
      data: trees,
      total,
      pageCount: Math.ceil(total / limit),
      page,
    };
  }

  async import(data) {
    const decodedString = data.buffer.toString('utf-8');
    try {
      let trees = [];
      const parsedJson = JSON.parse(decodedString);
      for (const feature of parsedJson) {
        const tree = new Tree();
        tree.name = feature['Tên cây']; // Map name
        tree.kind = feature['Loại cây']; // Map kind
        tree.variety = feature['Giống cây']; // Map variety
        tree.garden = feature['Tên vườn'];
        const garden = await this.gardenRepo.findOne({
          where: {
            id: feature['Tên vườn'],
          },
          relations: {
            owner: true,
          },
          select: {
            owner: {
              id: true,
            },
          },
        });
        tree.owner = garden.owner.id as any;
        tree.yearPlanted = feature['Năm trồng cây']; // Map yearPlanted
        tree.sellStatus = sellStatusMapping[feature['Trạng thái bán']]; // Assuming SellStatus enum includes READY
        tree.annualOutput = feature['Sản lượng TB năm (kg)']; // Map annualOutput
        tree.plantingType = plantingTypeMapping[feature['Kiểu vụ']]; // Assuming PlantingType enum includes CONTINUOUS
        tree.expectedOutput = feature['Sản lượng dự kiến (kg)']; // Map expectedOutput
        tree.expectedFruitingTime = parseInt(
          feature['Thời gian cho quả dự kiến'].replace('Tháng ', ''),
        ); // Extract month as number
        tree.ownershipPeriod = parseInt(
          feature['Quyền sở hữu'].replace(' năm', ''),
        ); // Extract years as number
        tree.hasCamera = feature['Có Camera'] === '1'; // Map hasCamera
        tree.coordinates = JSON.stringify(feature.coordinates);
        tree.price = feature['Giá bán'];
        trees.push(tree);
        await this.repo.save(tree);
      }
      return trees;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }
}
