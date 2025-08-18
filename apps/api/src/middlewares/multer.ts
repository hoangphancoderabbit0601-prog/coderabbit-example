import dayjs from 'dayjs';
import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import path from 'path';

export const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
});

const fileName = (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname);
  return `product_${dayjs().format('YYYYMMDDHHmmss')}${ext}`;
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join('product_image/');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, fileName(file));
  },
});

export const uploadImageProduct = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
