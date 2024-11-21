import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { Crud } from '@dataui/crud';
import { Garden } from './entities/garden.entity';
import { CreateGardenDto } from './garden.dto';
import { GardensService } from './gardens.service';

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
}
