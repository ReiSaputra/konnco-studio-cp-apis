import { ValidationError } from "../helpers/class/validation-error.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ message: `ValidationError: ${err.message}` });
  } else if (err instanceof FileUploadError) {
    return res.status(err.statusCode).json({ message: `FileUploadError: ${err.message}` });
  } else if (err instanceof Error) {
    return res.status(400).json({
      message: err.message,
      test: true,
    });
  } else {
    return res.status(500).json({ message: err.message });
  }
};

export { errorMiddleware };
