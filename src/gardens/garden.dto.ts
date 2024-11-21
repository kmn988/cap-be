import { ApiProperty } from '@dataui/crud/lib/crud';
import { IsNumber, IsString } from 'class-validator';

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
  unitArea: string;

  @ApiProperty({ required: true })
  @IsNumber()
  plantingArea: number;

  @ApiProperty({ required: true })
  @IsString()
  location: string;
}
