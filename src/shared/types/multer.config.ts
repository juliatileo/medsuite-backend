import { Request } from "express";
import multer, { FileFilterCallback, MulterError } from "multer";

export default {
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      return cb(new MulterError("LIMIT_UNEXPECTED_FILE"));
    }

    return cb(null, true);
  },
  limits: {
    fileSize: 2e7,
  },
  storage: multer.memoryStorage(),
};
