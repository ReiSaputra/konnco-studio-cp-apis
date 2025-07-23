import bcrypt from "bcrypt";
import { prisma } from "../database.js";
import { AuthError } from "../helpers/class/auth-error.js";

const loginAdminService = async (email, password) => {
  const findData = await prisma.admin.findUnique({
    where: {
      email: email.toLowerCase(),
    },
    select: {
      id: true,
      password: true,
      email: true,
      role: true,
    },
  });

  if (!findData) throw new AuthError("Username/Password is incorrect");

  const match = await bcrypt.compare(password, findData.password);
  if (!match) throw new AuthError("Username/Password is incorrect");

  const payload = {
    id: findData.id,
    email: findData.email,
    role: findData.role,
    time: Date.now(),
  };

  const tokenEncode = Buffer.from(JSON.stringify(payload)).toString("base64");

  await prisma.admin.update({
    where: { id: findData.id },
    data: { token: tokenEncode },
  });

  return { token: tokenEncode };
};

export { loginAdminService };
