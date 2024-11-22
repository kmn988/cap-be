import { Module } from '@nestjs/common';
import { TreesController } from './trees.controller';
import { TreesService } from './trees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tree } from './entities/tree.entity';
import { Garden } from '../gardens/entities/garden.entity';
import { GardensService } from '../gardens/gardens.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { StorageService } from '../storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tree, Garden, User])],
  controllers: [TreesController],
  providers: [TreesService, GardensService, UsersService, StorageService],
  exports: [TreesService],
})
export class TreesModule {}
