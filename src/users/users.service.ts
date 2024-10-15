import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignInUserDto } from './dto/signIn-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  // Auth sign-in
  async signIn(signInUserDto: SignInUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { firstName: string; lastName: string; email: string };
  }> {
    const user = await this.findByEmail(signInUserDto.email);

    if (user && (await bcrypt.compare(signInUserDto.password, user.password))) {
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
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const user = await this.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newPayload = { email: user.email, _id: user._id };

    const newAccessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '1h',
    });

    return { accessToken: newAccessToken };
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  // Find user by ID
  async findById(id: string): Promise<User | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return await this.userModel.find().select('-password').exec();
  }

  // Update users
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return updatedUser;
  }

  // Delete users
  async remove(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return {
      message: `User with ID "${id}" has been successfully deleted`,
    };
  }
}
