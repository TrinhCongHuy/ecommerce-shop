import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const multerConfig = {
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: 'project-nestjs',
        allowedFormats: ['jpg', 'png'],
        public_id: `${file.originalname.split('.')[0]}_${Date.now()}`,
      };
    },
  }),
};
