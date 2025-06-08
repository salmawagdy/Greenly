
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloud } from './cloudinary.js'; 

const storage = new CloudinaryStorage({
  cloudinary: cloud,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const uploadCloudFile = multer({ storage });

// Create the middleware for the fields you want
const uploadProductImages = uploadCloudFile.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

export { uploadCloudFile, uploadProductImages };
