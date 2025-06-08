import * as dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({ path: path.resolve('./src/config/.env.dev') });

import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloud = cloudinary.v2;
