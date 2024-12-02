import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from './user.interface';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { nanoid } from 'nanoid';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) public repo: Repository<User>,
    private readonly storageService: StorageService,
  ) {
    super(repo);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async createUser(dto: CreateUserDto) {
    const { name, email, password } = dto;
    const check = await this.repo.find({
      where: {
        email,
      },
    });

    if (check.length > 0) {
      throw new ConflictException('Email is already in use');
    }
    const user = new User();
    user.email = email;
    user.name = name;
    const hashedPassword = await this.hashPassword(password);
    user.password = hashedPassword;
    user.role = RoleEnum.USER;
    const savedUser = await this.repo.save(user);
    const buffer = Buffer.from(
      'https://png.pngtree.com/png-clipart/20231016/original/pngtree-custard-apple-fruit-watercolor-illustration-png-image_13320769.png',
      'utf-8',
    );

    const imageName = `${savedUser.id}.png`;
    user.image = imageName;
    await this.storageService.uploadImage('profile', imageName, buffer);
    const {
      id,
      email: returnEmail,
      name: returnName,
      role,
      isActive,
      image,
    } = await this.repo.save(user);
    return { id, email: returnEmail, name: returnName, role, isActive, image };
  }
  public async updateUser(
    id: string,
    dto: CreateUserDto,
    image: Express.Multer.File,
  ) {
    const { name, email, password } = dto;
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new ConflictException('User not found');
    }
    const hashedPassword = await this.hashPassword(password);
  }

  async import(data) {
    const decodedString = data.buffer.toString('utf-8');
    try {
      let users = [];
      const parsedJson = JSON.parse(decodedString);
      for (const feature of parsedJson) {
        const user = new User();
        user.name = feature['Họ tên chủ vườn'];
        user.email = feature['Email'];
        user.password = await this.hashPassword(nanoid());
        user.role = RoleEnum.OWNER;
        user.isActive = true;
        user.phoneNumber = feature['Số điện thoại'];
        user.address = feature['Địa chỉ nhà'];
        user.province = feature['Tỉnh'];
        user.district = feature['Huyện'];
        user.commune = feature['Xã'];
        users.push(user);
        await this.repo.save(user); // Await save operation
      }
      const returnedUsers = users.map((user) => {
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          address: user.address,
          province: user.province,
          district: user.district,
          commune: user.commune,
        };
      });
      return returnedUsers;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }
}
