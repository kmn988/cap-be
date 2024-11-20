import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { GoogleLoginDto, LoginDto, RefreshTokenDto } from './auth.dto';
import { Auth, google } from 'googleapis';
import { AuthType, RoleEnum } from '../users/user.interface';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  private googleAuth: Auth.OAuth2Client;
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    this.googleAuth = new google.auth.OAuth2(clientID, clientSecret);
  }

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
      expiresIn: '1m',
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
  public async loginGoogle(dto: GoogleLoginDto) {
    try {
      const { accessToken } = dto;
      const tokenInfo = await this.googleAuth.verifyIdToken({
        idToken: accessToken,
      });
      if (!tokenInfo) {
        throw new UnauthorizedException('Invalid Google token');
      }
      const { email, name } = tokenInfo.getPayload();
      return this.handleSSO(AuthType.GOOGLE, email, name);
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
  private async handleSSO(authType: AuthType, email: string, name = null) {
    if (!email) {
      throw new UnauthorizedException('Email is not found');
    }
    let user = await this.usersService.repo.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      const newUser = new User();
      newUser.name = name ? name : email.split('@')[0];
      newUser.authType = authType;
      newUser.email = email;
      newUser.role = RoleEnum.USER;
      newUser.password = await this.hashPassword(nanoid());
      user = await this.usersService.repo.save(newUser);
    }
    const payload = await this.getToken(user);

    return payload;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
