import { Module } from '@nestjs/common';
import { GardensController } from './gardens.controller';
import { GardensService } from './gardens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Garden } from './entities/garden.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Garden])],
  controllers: [GardensController],
  providers: [GardensService],
  exports: [GardensService],
})
export class GardensModule {}
