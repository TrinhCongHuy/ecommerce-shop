import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<any> {
    console.log('File received in upload service:', file);

    if (!file || !file.path) {
      console.error('No file path found');
      throw new Error('File upload failed');
    }

    return {
      url: file.path,
      public_id: file.filename,
      size: file.size,
    };
  }
}
