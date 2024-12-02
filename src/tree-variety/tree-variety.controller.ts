import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';
import { Crud } from '@dataui/crud';
import { TreeVariety } from './entities/tree-variety.entity';
import { Tree } from '../trees/entities/tree.entity';
import { TreeVarietyService } from './tree-variety.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('tree-variety')
@ApiTags('tree-varieties')
@UseGuards(AuthGuard)
@Crud({
  model: {
    type: TreeVariety,
  },
  // dto: {
  //   create: CreateTreeDto,
  // },
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
export class TreeVarietyController {
  constructor(public service: TreeVarietyService) {}

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
