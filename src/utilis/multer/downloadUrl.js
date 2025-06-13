import { v2 as cloudinary } from 'cloudinary';

export const getDownloadUrl = (publicId, fileName = 'document.pdf') => {
  const safeFileName = fileName.replace(/[^\w.-]+/g, '_');
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    flags: 'attachment',
    attachment: safeFileName,
    type: 'upload',
  });
};
