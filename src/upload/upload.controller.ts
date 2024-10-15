import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { multerConfig } from './multer-config';
import { Roles } from 'src/auths/decorators/roles.decorator';
import { Role } from 'src/auths/enums/role.enum';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';
import { RolesGuard } from 'src/auths/guards/roles.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadImage(file);
    return {
      message: 'Image uploaded successfully',
      data: result,
    };
  }
}
