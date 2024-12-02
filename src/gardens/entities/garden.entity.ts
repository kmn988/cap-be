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
  ownershipType: string;

  @Column()
  areaUnit: string;

  @Column()
  areaSize: string;

  @Column({ nullable: true })
  plantingProcedure: string;

  @Column({ nullable: true })
  cetificate: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @Column()
  commune: string;

  @Column({ type: 'json', nullable: true })
  coordinates: string;

  @ManyToOne(() => User, (user) => user.gardens, { nullable: true })
  owner: User;

  @OneToMany(() => Tree, (tree) => tree.garden, { nullable: true })
  trees: Tree[];
}
