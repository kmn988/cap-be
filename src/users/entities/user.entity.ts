import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../utils/baseEntity';
import { AuthType, RoleEnum } from '../user.interface';
import { Garden } from '../../gardens/entities/garden.entity';
import { Tree } from '../../trees/entities/tree.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
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
  @OneToMany(() => Tree, (tree) => tree.owner, { nullable: true })
  trees: Tree[];

  @OneToMany(() => Garden, (garden) => garden.owner, { nullable: true })
  gardens: Garden[];

  @Column({ nullable: true, type: 'json' })
  image: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  province: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  commune: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  description: string;
}
