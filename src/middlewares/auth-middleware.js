const authMiddleware = (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new TokenError("Unauthorized");

    const token = req.headers.authorization.split("")[1];
    return next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware };
