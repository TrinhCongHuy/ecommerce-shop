import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from '../users/schemas/user.schema';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Auth sign-up
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const userExists = await this.userService.findByEmail(
      authCredentialsDto.email,
    );

    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(authCredentialsDto.password, 10);
    return this.userService.create({
      password: hashedPassword,
      ...authCredentialsDto,
    });
  }

  // Auth sign-in
  async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { firstName: string; lastName: string; email: string };
  }> {
    const user = await this.userService.findByEmail(signInCredentialsDto.email);

    if (
      user &&
      (await bcrypt.compare(signInCredentialsDto.password, user.password))
    ) {
      const payload = { _id: user?._id, email: user?.email };

      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15s',
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      return {
        accessToken,
        refreshToken,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  // Refresh-token
  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { email: user.email, _id: user._id };

      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
