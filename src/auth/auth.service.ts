import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto, RefreshTokenDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  public async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.usersService.repo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new UnauthorizedException();
    }
    const payload = await this.getToken(user);

    await this.updateRefreshToken(user.id, payload.refreshToken);

    return { ...payload };
  }

  public async refreshToken(dto: RefreshTokenDto) {
    const { email, refreshToken } = dto;
    const user = await this.usersService.repo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }
    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException();
    }

    const payload = await this.getToken(user);

    return { token: payload.token };
  }
  private async getToken(user: User) {
    const payload = {
      email: user.email,
      role: user.role,
      username: user.name,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id },
      { expiresIn: '7d' },
    );
    return { ...payload, token, refreshToken };
  }

  private async updateRefreshToken(id: string, refreshToken: string) {
    await this.usersService.repo.update({ id }, { refreshToken });
  }
}
