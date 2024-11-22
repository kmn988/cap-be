import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Tree } from './entities/tree.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GardensService } from '../gardens/gardens.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TreesService extends TypeOrmCrudService<Tree> {
  constructor(
    @InjectRepository(Tree) public repo: Repository<Tree>,
    private readonly gardenService: GardensService,
    private readonly userService: UsersService,
  ) {
    super(repo);
  }

  async getTree(id: string) {
    const tree = await this.repo.findOne({
      where: { id },
      loadRelationIds: {
        relations: ['garden'],
        disableMixedMap: true,
      },
    });
    if (!tree) {
      throw new BadRequestException('Tree not found');
    }
    const garden = await this.gardenService.findOne({
      where: {
        id: tree.garden.id,
      },
      select: [
        'id',
        'name',
        'location',
        'kind',
        'variety',
        'unitArea',
        'plantingArea',
      ],
      loadRelationIds: {
        relations: ['gardener'],
        disableMixedMap: true,
      },
    });
    const gardener = await this.userService.findOne({
      where: {
        id: garden.gardener.id,
      },
      select: ['id', 'name', 'email'],
    });
    delete garden.gardener;
    tree.garden = garden;
    tree.gardener = gardener;

    return tree;
  }
}
