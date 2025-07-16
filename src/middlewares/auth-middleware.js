import { prisma } from "../database.js";
import { TokenError } from "../helpers/class/token-error.js";

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new TokenError("Unauthorized");

    const token = req.headers.authorization.split("")[1];

    if (!token) throw new TokenError("Unauthorized");

    const findToken = await prisma.admin.findUnique({
      where: {
        token: token,
      },
    });

    if (!findToken) throw new TokenError("Unauthorized");

    next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware };
