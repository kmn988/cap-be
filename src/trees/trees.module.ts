import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Garden } from '../gardens/entities/garden.entity';
import { GardensService } from '../gardens/gardens.service';
import { Tree } from './entities/tree.entity';
import { TreesController } from './trees.controller';
import { TreesService } from './trees.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tree, Garden])],
  controllers: [TreesController],
  providers: [TreesService, GardensService],
  exports: [TreesService],
})
export class TreesModule {}
