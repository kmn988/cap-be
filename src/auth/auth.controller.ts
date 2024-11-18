import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { AuthGuard, Public } from '../guard/auth.guard';

@ApiTags('auth')
@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(public authService: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
