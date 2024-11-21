import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}
  @Get('*')
  @ApiParam({ name: 'path', type: 'string' })
  getImage(@Param() params: string, @Res() res: Response) {
    const reqPath = params['0'];
    const [bucket, name] = reqPath.split('/');

    return this.storageService.getImage(bucket, name, res);
  }
}
