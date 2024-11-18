import { Crud, Override } from '@dataui/crud';
import { Body, Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CreateUserDto } from './user.dto';
import { UsersService } from './users.service';
import { AuthGuard, Public } from '../guard/auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@Crud({
  model: {
    type: User,
  },
  dto: {
    create: CreateUserDto,
  },
  query: {
    exclude: ['password', 'refreshToken'],
  },
})
export class UsersController {
  constructor(public service: UsersService) {}
  @Public()
  @Override('createOneBase')
  createUser(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }
}
