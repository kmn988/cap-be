import { ApiProperty } from '@dataui/crud/lib/crud';
import { IsNumber, IsString, IsUUID } from 'class-validator';
import { Garden } from './entities/garden.entity';

export class CreateGardenDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  kind: string;

  @ApiProperty({ required: true })
  @IsString()
  variety: string;

  @ApiProperty({ required: true })
  @IsString()
  areaUnit: string;

  @ApiProperty({ required: true })
  @IsNumber()
  areaSize: number;

  @ApiProperty({ required: true })
  @IsString()
  location: string;

  @ApiProperty({ required: true })
  @IsUUID()
  owner: string;
}

export class ImportGardenDto {
  @ApiProperty({ type: 'object', format: 'binary' })
  file: any;
}
