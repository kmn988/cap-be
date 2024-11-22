import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Tree } from './entities/tree.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GardensService } from '../gardens/gardens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TreesService extends TypeOrmCrudService<Tree> {
  constructor(@InjectRepository(Tree) public repo: Repository<Tree>) {
    super(repo);
  }

  async getTree(id: string) {
    const tree = await this.repo.findOne({
      where: { id },
      relations: {
        garden: { gardener: true }, // Load garden and gardener in one query
      },
      select: {
        id: true,
        name: true,
        kind: true,
        variety: true,
        description: true,
        growingArea: true,
        yearPlanted: true,
        sellStatus: true,
        price: true,
        garden: {
          id: true,
          name: true,
          location: true,
          kind: true,
          variety: true,
          unitArea: true,
          plantingArea: true,
          gardener: {
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
      const { gardener, ...gardenWithoutGardener } = tree.garden;
      tree.garden = gardenWithoutGardener as any;
      tree.gardener = gardener; // Assign gardener at the tree level
    }

    return tree;
  }

  async getManyTrees() {
    const trees = await this.repo
      .createQueryBuilder('tree')
      .leftJoinAndSelect('tree.garden', 'garden')
      .leftJoinAndSelect('garden.gardener', 'gardener')
      .select([
        'tree.id',
        'tree.name',
        'tree.kind',
        'tree.variety',
        'tree.description',
        'tree.growingArea',
        'tree.yearPlanted',
        'tree.sellStatus',
        'tree.price',
        'garden.id',
        'garden.name',
        'garden.location',
        'garden.kind',
        'garden.variety',
        'garden.unitArea',
        'garden.plantingArea',
        'gardener.id',
        'gardener.name',
        'gardener.email',
      ])
      .getMany(); // Retrieve multiple records

    trees.forEach((tree) => {
      if (tree.garden) {
        const { gardener, ...gardenWithoutGardener } = tree.garden;
        tree.garden = gardenWithoutGardener as any;
        tree.gardener = gardener;
      }
    });

    return trees;
  }
}
