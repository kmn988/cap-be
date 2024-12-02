import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { User } from './entities/user.entity';
import { ApiProperty } from '@dataui/crud/lib/crud';

export class CreateUserDto extends User {
  @ApiProperty({ require: true })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ require: true })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ require: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}

export class UpdateUserDto extends User {
  @ApiProperty({ require: true })
  @IsString()
  city: string;

  @ApiProperty({ require: true })
  @IsString()
  name: string;

  @ApiProperty({ require: true })
  @IsString()
  country: string;

  @ApiProperty({ require: true })
  @IsString()
  address: string;

  @ApiProperty({ require: true })
  @IsString()
  zipcode: string;

  @ApiProperty({ require: true })
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class ImportUserDto {
  @ApiProperty({ type: 'object', format: 'binary' })
  file: any;
}
