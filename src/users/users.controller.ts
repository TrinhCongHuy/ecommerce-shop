import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
  Patch,
  Delete,
  UseGuards,
  // Put,
  // UseInterceptors,
  // UploadedFiles,
  Headers,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auths/jwt-auth.guard';
import { Roles } from '../auths/decorators/roles.decorator';
import { Role } from '../auths/enums/role.enum';
import { RolesGuard } from 'src/auths/guards/roles.guard';
// import { FilesInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import { SignInUserDto } from './dto/signIn-user.dto';
// import { AuthCredentialsDto } from './dto/auth-credentials.dto';
// import { SignInCredentialsDto } from './dto/signIn-credentials.dto';

@ApiTags('users')
@SkipThrottle()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // [POST] /auth/sign-up
  @Post('sign-up')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
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
  async signIn(@Body(new ValidationPipe()) signInUserDto: SignInUserDto) {
    try {
      return await this.userService.signIn(signInUserDto);
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
      return await this.userService.refreshToken(token);
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

  // [POST] /users
  @Post()
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: User,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create user. ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // [GET] /users/list-user
  @SkipThrottle({ default: false })
  @Get('list-user')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users retrieved successfully.',
    type: [User],
  })
  async getListUser(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to retrieve users. ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // [GET] /users/:id
  @Get(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User details retrieved successfully.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  async detailUser(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to retrieve user. ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // [PATCH] /users/:id
  @Patch(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to update user. ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // [DELETE] /users/:id
  @SkipThrottle({ default: false })
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeUser(@Param('id') id: string): Promise<void> {
    try {
      await this.userService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Failed to delete user. ' + error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('roles')
  @UseGuards(JwtAuthGuard)
  getRoles(): string[] {
    return Object.values(Role);
  }

  // [PUT] /users/upload/:id
  // @Put('/upload/:id')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FilesInterceptor('files'))
  // async uploadImages(
  //   @Param('id') id: string,
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  // ): Promise<{ message: string }> {
  //   try {
  //     console.log('id', id);
  //     console.log('files', files);
  //     return { message: 'Files uploaded successfully' };
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.INTERNAL_SERVER_ERROR,
  //         error: 'Failed to upload files. ' + error.message,
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
