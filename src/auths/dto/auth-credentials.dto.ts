import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../enums/role.enum';

export class AuthCredentialsDto {
  @IsEmail({}, { message: 'Email không hợp lệ, vui lòng nhập lại' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsOptional()
  @IsString({ message: 'Tên không được để trống' })
  firstName: string;

  @IsOptional()
  @IsString({ message: 'Họ không được để trống' })
  lastName: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  role: Role[];
}
