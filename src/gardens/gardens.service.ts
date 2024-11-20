import { Injectable } from '@nestjs/common';
import { Garden } from './entities/garden.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GardensService extends TypeOrmCrudService<Garden> {
  constructor(@InjectRepository(Garden) repo: Repository<Garden>) {
    super(repo);
  }
}
