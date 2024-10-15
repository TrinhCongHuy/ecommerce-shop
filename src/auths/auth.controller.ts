import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // [POST] /auth/sign-up
  @Post('sign-up')
  async signUp(
    @Body(new ValidationPipe()) authCredentialsDto: AuthCredentialsDto,
  ) {
    try {
      return await this.authService.signUp(authCredentialsDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to sign up. ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // [POST] /auth/sign-in
  @Post('sign-in')
  async signIn(
    @Body(new ValidationPipe()) signInCredentialsDto: SignInCredentialsDto,
  ) {
    try {
      return await this.authService.signIn(signInCredentialsDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Failed to sign in. ' + error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // [POST] /auth/refresh-token
  @Post('/refresh-token')
  async refreshToken(@Headers('authorization') authorization: string) {
    try {
      if (!authorization) {
        throw new UnauthorizedException(
          'Refresh token not found in request headers',
        );
      }

      const token = authorization.replace('Bearer ', '');
      return await this.authService.refreshToken(token);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Failed to refresh token. ' + error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
