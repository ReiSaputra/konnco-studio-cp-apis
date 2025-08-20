import { prisma } from "../database.js";
import { TokenError } from "../helpers/class/token-error.js";
import CryptoJS from "crypto-js";
import "dotenv/config";

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new TokenError("Unauthorized");

    const token = req.headers.authorization.split(" ")[1];

    if (!token) throw new TokenError("Unauthorized");

    const bytes = CryptoJS.AES.decrypt(token, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const decryptedPayload = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
    const findUser = await prisma.admin.findUnique({
      where: {
        id: decryptedPayload.id,
        token: token,
      },
      select: {
        id: true,
        name: true,
        role: true,
        permissions: true,
      },
    });

    if (!findUser) throw new TokenError("Unauthorized", 401);
    
    req.user = findUser;

    next();
  } catch (error) {
    next(error);
  }
};

export { authMiddleware };
