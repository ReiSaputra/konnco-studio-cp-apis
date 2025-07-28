import multer, { diskStorage } from "multer";
import path from "path";

const createMulterUpload = (folderPath, maxSizeMB, mime) => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === mime) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  });

  return upload;
};

export { createMulterUpload };
