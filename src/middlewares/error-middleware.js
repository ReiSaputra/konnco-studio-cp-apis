const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ message: err.message });
  } else {
    return res.status(500).json({ message: err.message });
  }
};
