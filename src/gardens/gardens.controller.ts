import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Public } from '../guard/auth.guard';
import { Crud, CrudRequest, Override, ParsedRequest } from '@dataui/crud';
import { Garden } from './entities/garden.entity';
import { CreateGardenDto, ImportGardenDto } from './garden.dto';
import { GardensService } from './gardens.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('gardens')
@ApiTags('gardens')
@UseGuards(AuthGuard)
@Crud({
  model: {
    type: Garden,
  },
  dto: {
    create: CreateGardenDto,
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
export class GardensController {
  constructor(public service: GardensService) {}

  @Override('getOneBase')
  getGarden(@Param('id') id: string) {
    return this.service.getGarden(id);
  }
  @Public()
  @Override('getManyBase')
  getManyGardens(@ParsedRequest() req: CrudRequest) {
    return this.service.getManyGardens(req);
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
