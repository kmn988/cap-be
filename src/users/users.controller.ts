import { Crud, Override } from '@dataui/crud';
import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';
import { AuthGuard, Public } from '../guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
export class UsersController {
  constructor(public service: UsersService) {}
  @Public()
  @Override('createOneBase')
  createUser(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }

  @Override('updateOneBase')
  @UseInterceptors(FileInterceptor('poster'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateUserDto,
  })
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.service.updateUser(id, dto, image);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  import(@UploadedFile() data: Express.Multer.File) {
    return this.service.import(data);
  }
}
