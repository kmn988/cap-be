import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/baseEntity';
import { User } from '../../users/entities/user.entity';
import { Tree } from '../../trees/entities/tree.entity';

@Entity('gardens')
export class Garden extends BaseEntity {
  @Column()
  name: string;

  @Column()
  kind: string;

  @Column()
  variety: string;

  @Column()
  unitArea: string;

  @Column()
  plantingArea: number;

  @ManyToOne(() => User, (user) => user.gardens, { nullable: true })
  gardener: User;

  @OneToMany(() => Tree, (tree) => tree.garden, { nullable: true })
  trees: Tree[];

  @Column()
  location: string;
}
