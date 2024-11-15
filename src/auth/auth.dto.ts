import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;
}

export class ReauthDto {
  @ApiProperty({ required: true })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}
