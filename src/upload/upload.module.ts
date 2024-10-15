import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryConfigService } from './cloudinary.config';

@Module({
  controllers: [UploadController],
  providers: [UploadService, CloudinaryConfigService],
  exports: [UploadService],
})
export class UploadModule {}
