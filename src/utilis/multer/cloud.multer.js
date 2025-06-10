
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloud } from './cloudinary.js'; 

const storage = new CloudinaryStorage({
  cloudinary: cloud,
  params: {
    folder: "products",
  },
});

const licenseStorage = new CloudinaryStorage({
  cloudinary: cloud,
  params: {
    folder: "license",
  },
});


const uploadCloudFile = multer({ storage });


export const uploadCloudProductImages = uploadCloudFile.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);


export const uploadLicenseCloud = multer({ storage: licenseStorage });

export const uploadCloudLicenseFiles = uploadLicenseCloud.fields([
  { name: 'nationalId', maxCount: 1 },
  { name: 'documents', maxCount: 10 },
]);
