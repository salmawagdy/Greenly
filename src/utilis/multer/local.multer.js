import path from 'node:path';
import fs from 'node:fs';
import multer from "multer";

export const uploadFileDisk = (customPath = 'general') => {
    const basePath = `uploads/${customPath}`;
    const fullPath = path.resolve(`./src/${basePath}`);

    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullPath);
        },
        filename: (req, file, cb) => {
            const finalFileName = Date.now() + '_' + Math.round(Math.random() + 1E9) + file.originalname;
            file.finalPath = basePath + '/' + finalFileName;
            cb(null, finalFileName);
        }
    });

    function fileFilter(req, file, cb) {
        cb(null, true);
    }

    return multer({ storage, fileFilter });
}

export const uploadProductImages = uploadFileDisk('products').fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

export const uploadLicenseFiles = uploadFileDisk('license').fields([
    { name: 'nationalId', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
]);