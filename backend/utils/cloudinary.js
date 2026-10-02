import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config();

const cloudinaryV2 = cloudinary.v2;

/* ─── Configure Cloudinary ───────────────────────────────── */
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ─── Multer-Cloudinary storage ──────────────────────────── */
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: 'blogvite/posts',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
    transformation: [
      { width: 1400, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
    ],
  },
});

/* ─── File filter ────────────────────────────────────────── */
const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, webp, gif, avif)'), false);
  }
};

/* ─── Exported multer instance ───────────────────────────── */
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
});

/* ─── Helper: delete image from Cloudinary ───────────────── */
export const deleteImage = async (publicId) => {
  if (!publicId) return null;
  try {
    return await cloudinaryV2.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
    return null;
  }
};

export { cloudinaryV2 as cloudinary };
