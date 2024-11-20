import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { Tree } from './entities/tree.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TreesService extends TypeOrmCrudService<Tree> {
  constructor(@InjectRepository(Tree) public repo: Repository<Tree>) {
    super(repo);
  }
}
