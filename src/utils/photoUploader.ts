import { catchAsync } from '../app/shared/catchAsync';
import { uploadFile } from '../helper/fileUploader';

// Middleware for handling one image upload
export const parseSingleImageWithData = () => {
  return [
    uploadFile.single('image'),
    catchAsync(async (req, _res, next) => {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    }),
  ];
};

// Middleware for handling multiple images upload
export const parseMultipleImagesWithData = () => {
  return [
    uploadFile.array('images', 10), // Adjust 10 to your desired limit
    catchAsync(async (req, _res, next) => {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    }),
  ];
};
