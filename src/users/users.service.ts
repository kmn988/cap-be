import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from './user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) public repo: Repository<User>) {
    super(repo);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async createUser(dto: CreateUserDto) {
    const { name, email, password } = dto;
    const user = new User();
    user.email = email;
    user.name = name;
    const hashedPassword = await this.hashPassword(password);
    user.password = hashedPassword;
    user.role = RoleEnum.ADMIN;
    const check = await this.repo.find({
      where: {
        email,
      },
    });

    if (check.length > 0) {
      throw new ConflictException('Email is already in use');
    }
    const {
      id,
      email: returnEmail,
      name: returnName,
      role,
      isActive,
    } = await this.repo.save(user);
    return { id, email: returnEmail, name: returnName, role, isActive };
  }
}
