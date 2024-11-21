import { ApiProperty } from '@dataui/crud/lib/crud';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateTreeDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  description: string;

  @ApiProperty({ required: true })
  @IsString()
  kind: string;

  @ApiProperty({ required: true })
  @IsString()
  variety: string;

  @ApiProperty({ required: true })
  @IsString()
  growingArea: string;

  @ApiProperty({ required: true })
  @IsUUID()
  garden: string;

  @ApiProperty({ required: true })
  @IsNumber()
  yearPlanted: number;

  @ApiProperty({ required: true })
  @IsBoolean()
  sellStatus: boolean;

  @ApiProperty({ required: true })
  @IsNumber()
  price: number;
}
