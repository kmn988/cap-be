import { Module } from '@nestjs/common';
import { TreeVarietyController } from './tree-variety.controller';
import { TreeVarietyService } from './tree-variety.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeVariety } from './entities/tree-variety.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TreeVariety])],
  controllers: [TreeVarietyController],
  providers: [TreeVarietyService],
})
export class TreeVarietyModule {}
