import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/baseEntity';
import { AuthType, RoleEnum } from '../user.interface';
import { Garden } from '../../gardens/entities/garden.entity';
import { Tree } from '../../trees/entities/tree.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: null })
  refreshToken: string;

  @Column({ default: RoleEnum.ADMIN })
  role: string;

  @Column({ type: 'enum', enum: AuthType, default: AuthType.BASIC })
  authType: AuthType;
  @OneToMany(() => Tree, (tree) => tree.gardener, { nullable: true })
  trees: Tree[];

  @OneToMany(() => Garden, (garden) => garden.gardener, { nullable: true })
  gardens: Garden[];
}
