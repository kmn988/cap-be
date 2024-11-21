import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { Crud } from '@dataui/crud';
import { Tree } from './entities/tree.entity';
import { CreateTreeDto } from './tree.dto';

@Controller('trees')
@ApiTags('trees')
@UseGuards(AuthGuard)
@Crud({
  model: {
    type: Tree,
  },
  dto: {
    create: CreateTreeDto,
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
  //   query: {
  //     exclude: ['password', 'refreshToken'],
  //   },
})
export class TreesController {}
