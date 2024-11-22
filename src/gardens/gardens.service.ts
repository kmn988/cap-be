import { BadRequestException, Injectable } from '@nestjs/common';
import { Garden } from './entities/garden.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GardensService extends TypeOrmCrudService<Garden> {
  constructor(@InjectRepository(Garden) repo: Repository<Garden>) {
    super(repo);
  }

  async getGarden(id: string) {
    const garden = await this.repo.findOne({
      where: { id },
      relations: {
        gardener: true, // Load gardener in one query
      },
      select: {
        gardener: {
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
}
