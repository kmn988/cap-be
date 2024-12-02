import { BadRequestException, Injectable } from '@nestjs/common';
import { Garden } from './entities/garden.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudRequest } from '@dataui/crud';

@Injectable()
export class GardensService extends TypeOrmCrudService<Garden> {
  constructor(@InjectRepository(Garden) repo: Repository<Garden>) {
    super(repo);
  }

  async getGarden(id: string) {
    const garden = await this.repo.findOne({
      where: { id },
      relations: {
        owner: true, // Load owner in one query
      },
      select: {
        owner: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!garden) {
      throw new BadRequestException('Garden not found');
    }
    return garden;
  }

  async getManyGardens(req: CrudRequest) {
    const { limit, offset, page, sort, filter } = req.parsed;

    const query = await this.repo
      .createQueryBuilder('garden')
      .leftJoinAndSelect('garden.owner', 'owner')
      .select([
        'garden.id',
        'garden.name',
        'garden.kind',
        'garden.variety',
        'garden.areaUnit',
        'garden.areaSize',
        'garden.ownershipType',
        'garden.plantingProcedure',
        'garden.cetificate',
        'garden.province',
        'garden.district',
        'garden.commune',
        'garden.coordinates',
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
        query.orderBy(`gardens."${sortOrder.field}"`, sortOrder.order);
      }
    }

    if (filter && filter.length > 0) {
      for (const filterField of filter) {
        if (filterField.field.includes('.')) {
          query.andWhere(`${filterField.field} = :value`, {
            value: filterField.value,
          });
        } else {
          query.andWhere(`gardens."${filterField.field}" ILIKE :appName`, {
            appName: `%${filterField.value}%`,
          });
        }
      }
    }
    const gardens = await query.getMany();
    const total = await query.getCount();

    return {
      count: gardens.length,
      data: gardens,
      total,
      pageCount: Math.ceil(total / limit),
      page,
    };
  }

  async import(data) {
    const decodedString = data.buffer.toString('utf-8');
    try {
      let gardens = [];
      const parsedJson = JSON.parse(decodedString);
      for (const feature of parsedJson) {
        const garden = new Garden();
        garden.name = feature['Tên vườn'];
        garden.kind = feature['Loại cây'];
        garden.variety = feature['Các giống cây'];
        garden.areaUnit = feature['Đơn vị diện tích'];
        garden.ownershipType = feature['Sở hữu'];
        garden.areaSize = feature['Diện tích trồng'];
        garden.plantingProcedure = feature['Quy trình áp dụng'];
        garden.cetificate = feature['Chứng nhận'];
        garden.owner = feature['Chủ vườn'];
        garden.province = feature['Tỉnh'];
        garden.district = feature['Huyện'];
        garden.commune = feature['Xã'];
        gardens.push(garden);
        garden.coordinates = JSON.stringify(feature.coordinates);
        await this.repo.save(garden);
      }
      return gardens;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }
}
