import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../utils/baseEntity';
import { User } from '../../users/entities/user.entity';
import { Garden } from '../../gardens/entities/garden.entity';

@Entity('trees')
export class Tree extends BaseEntity {
  @Column()
  name: string;

  @Column()
  kind: string;

  @Column()
  variety: string;

  @Column()
  description: string;

  @Column()
  growingArea: string;

  @ManyToOne(() => Garden, (garden) => garden.trees, { nullable: true })
  garden: Garden;

  @ManyToOne(() => User, (user) => user.trees, { nullable: true })
  gardener: User;

  @Column()
  yearPlanted: number;

  @Column()
  sellStatus: boolean;

  @Column()
  price: number;
}
