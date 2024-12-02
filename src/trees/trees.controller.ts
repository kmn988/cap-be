import { Crud, CrudRequest, Override, ParsedRequest } from '@dataui/crud';
import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorator/role.decorator';
import { AuthGuard, Public } from '../guard/auth.guard';
import { RoleEnum } from '../users/user.interface';
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
  @Roles([RoleEnum.OWNER])
  getTree(@Param('id') id: string) {
    return this.service.getTree(id);
  }

  @Public()
  @Override('getManyBase')
  getManyTrees(@ParsedRequest() req: CrudRequest) {
    return this.service.getManyTrees(req);
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
