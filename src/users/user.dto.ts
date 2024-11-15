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
