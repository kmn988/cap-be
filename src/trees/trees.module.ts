import { Module } from '@nestjs/common';
import { TreesController } from './trees.controller';
import { TreesService } from './trees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tree } from './entities/tree.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tree])],
  controllers: [TreesController],
  providers: [TreesService],
  exports: [TreesService],
})
export class TreesModule {}
