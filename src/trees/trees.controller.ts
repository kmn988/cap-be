import { Controller, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { Crud, Override, ParsedRequest } from '@dataui/crud';
import { Tree } from './entities/tree.entity';
import { CreateTreeDto } from './tree.dto';
import { TreesService } from './trees.service';

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
export class TreesController {
  constructor(public service: TreesService) {}

  @Override('getOneBase')
  getTree(@ParsedRequest() req, @Param('id') id: string) {
    return this.service.getTree(id);
  }

  @Override('getManyBase')
  getManyTrees() {
    return this.service.getManyTrees();
  }
}
