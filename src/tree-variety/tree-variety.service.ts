import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { TreeVariety } from './entities/tree-variety.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Garden } from '../gardens/entities/garden.entity';

@Injectable()
export class TreeVarietyService extends TypeOrmCrudService<TreeVariety> {
  constructor(@InjectRepository(TreeVariety) repo: Repository<TreeVariety>) {
    super(repo);
  }
  async import(data) {
    const decodedString = data.buffer.toString('utf-8');
    try {
      let treeVarieties = [];
      const parsedJson = JSON.parse(decodedString);
      for (const feature of parsedJson) {
        const treeVariety = new TreeVariety();
        treeVariety.name = feature['Tên vườn'];
        treeVariety.name = feature['Tên giống']; // Map "Tên giống" to name
        treeVariety.variety = feature['Phân loại']; // Map "Phân loại" to variety
        treeVariety.type = feature['Chủng loại']; // Map "Chủng loại" to type
        treeVariety.origin = feature['Nguồn gốc']; // Map "Nguồn gốc" to origin
        treeVariety.description = feature['Ngoại hình']; // Map "Ngoại hình" to description
        treeVariety.taste = feature['Mùi vị']; // Map "Mùi vị" to taste
        if (feature['Cân nặng TB (1 quả)']) {
          treeVariety.minWeight = feature['Cân nặng TB (1 quả)']; // Map "Cân nặng TB (1 quả)" to minWeight
        }
        if (feature['Cân nặng tối đa (1 quả)']) {
          treeVariety.maxWeight = feature['Cân nặng tối đa (1 quả)'];
        }
        treeVarieties.push(treeVariety);
        await this.repo.save(treeVariety);
      }
      return treeVarieties;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }
}
