import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloud } from './cloudinary.js';
import path from 'path';

const productStorage = new CloudinaryStorage({
  cloudinary: cloud,
  params: {
    folder: "products",
    resource_type: 'image'
  },
});

const uploadCloudProduct = multer({ storage: productStorage });

export const uploadCloudProductImages = uploadCloudProduct.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);
const licenseStorage = new CloudinaryStorage({
  cloudinary: cloud,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImage = file.mimetype.startsWith('image/');

    return {
      folder: 'license',
      resource_type: isImage ? 'image' : 'raw', // PDF goes as raw
      public_id: `${Date.now()}_${path.basename(file.originalname, ext)}`,
      format: ext.replace('.', ''),
      use_filename: true,
      unique_filename: true,
      overwrite: true
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type.'), false);
  }
};

const uploadLicense = multer({
  storage: licenseStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

export const uploadCloudLicenseFiles = uploadLicense.fields([
  { name: 'nationalId', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]);
