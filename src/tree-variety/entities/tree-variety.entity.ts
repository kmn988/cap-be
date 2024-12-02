import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/baseEntity';
import { Tree } from '../../trees/entities/tree.entity';

@Entity('tree-varieties')
export class TreeVariety extends BaseEntity {
  @Column()
  name: string;

  @Column()
  variety: string;

  @Column()
  type: string;

  @Column()
  origin: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  taste: string;

  @Column({ nullable: true, type: 'float' })
  minWeight: number;

  @Column({ nullable: true, type: 'float' })
  maxWeight: number;

  @OneToMany(() => Tree, (tree) => tree.variety)
  trees: Tree[];
}
