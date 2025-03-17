import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import sharp from 'sharp';

import multerConfig from '@shared/types/multer.config';

export function upload(field: string): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadFunc = multer(multerConfig).single(field);

    uploadFunc(req, res, async (err) => {
      if (err) {
        try {
          switch (err.code) {
            case 'LIMIT_INVALID_TYPE':
              throw new Error('Invalid file type');

            case 'LIMIT_FILE_SIZE':
              throw new Error('File size is too large');

            default:
              throw new Error('Something went wrong');
          }
        } catch (error) {
          const errorAsClass = error as Error;

          return res.status(400).json({ message: errorAsClass.message });
        }
      }

      if (req.file) {
        try {
          const filename = `${Date.now()}-${randomUUID()}${path.extname(req.file.originalname)}`;
          const saveTo = path.resolve('uploads');
          const filePath = path.join(saveTo, filename);

          await sharp(req.file.buffer).resize({ width: 300, height: 300 }).jpeg({ quality: 30 }).toFile(filePath);

          req.file.filename = filename;

          next();
        } catch (error) {
          const errorAsClass = error as Error;

          return res.status(400).json({ message: errorAsClass.message });
        }
      } else {
        return next();
      }
    });
  };
}
