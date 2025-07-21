import multer from "multer";
import { ValidationError } from "../helpers/class/validation-error.js";
import { FileUploadError } from "../helpers/class/file-upload-error.js";
import { PropertyError } from "../helpers/class/property-error.js";
import { PrismaClientInitializationError } from "../generated/prisma/runtime/library.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode || 400).json({ message: `ValidationError: ${err.message}` });
  } else if (err instanceof PropertyError) {
    return res.status(err.statusCode || 400).json({ message: `PropertyError: ${err.message}` });
  } else if (err instanceof FileUploadError) {
    return res.status(err.statusCode || 400).json({ message: `FileUploadError: ${err.message}` });
  } else if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `MulterError: ${err.message}` });
  } else if (err instanceof PrismaClientInitializationError) {
    return res.status(500).json({ message: `PrismaClientInitializationError: ${err.message}` });
  } else if (err instanceof Error) {
    return res.status(400).json({ message: `Error: ${err.message}` });
  } else {
    return res.status(500).json({ message: `Internal Server Error` });
  }
};

export { errorMiddleware };
