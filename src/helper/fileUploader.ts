import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import config from '../app/config';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.cloudApiKey,
  api_secret: config.cloudApiS,
});

export const sendImageToCloudinary = (
  imageName: string,
  buffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: imageName.trim() },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload error: ${error.message}`));
        } else {
          resolve(result as UploadApiResponse);
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// Multer memory storage configuration
const storage = multer.memoryStorage();

// Exporting multer upload middleware with memory storage
export const uploadFile = multer({ storage: storage });
