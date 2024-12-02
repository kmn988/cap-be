import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/baseEntity';
import { User } from '../../users/entities/user.entity';
import { Garden } from '../../gardens/entities/garden.entity';
import { PlantingType, SellStatus } from '../tree.interface';
import { TreeVariety } from '../../tree-variety/entities/tree-variety.entity';

@Entity('trees')
export class Tree extends BaseEntity {
  @Column()
  name: string;

  @Column()
  kind: string;

  @ManyToOne(() => TreeVariety, (treeVariety) => treeVariety.trees, {
    nullable: true,
  })
  variety: TreeVariety;

  @ManyToOne(() => Garden, (garden) => garden.trees, { nullable: true })
  garden: Garden;

  @ManyToOne(() => User, (user) => user.trees, { nullable: true })
  owner: User;

  @Column()
  yearPlanted: number;

  @Column({ type: 'enum', enum: SellStatus })
  sellStatus: SellStatus;

  @Column({ type: 'float' })
  annualOutput: number;

  @Column({ type: 'enum', enum: PlantingType })
  plantingType: PlantingType;

  @Column({ type: 'float' })
  expectedOutput: number;

  @Column()
  expectedFruitingTime: number;

  @Column()
  ownershipPeriod: number;

  @Column({ nullable: true })
  hasCamera: boolean;

  @Column({ type: 'json', nullable: true })
  coordinates: string;

  @Column()
  price: number;
}
