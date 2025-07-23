import bcrypt from "bcrypt";

import { prisma } from "../database.js";
import { AuthError } from "../helpers/class/auth-error.js";

const loginAdminService = async (email, password) => {
  const findData = await prisma.admin.findUnique({
    where: {
      email: email,
    },
    select: {
      password: true,
      email: true,
    },
  });

  if (!findData) throw new AuthError("Username/Password is incorrect");

  const comparePassword = await bcrypt.compare(password, findData.password);

  if (!comparePassword) throw new AuthError("Username/Password is incorrect");

  const findToken = await prisma.admin.findUnique({
    where: {
      email: email,
    },
    select: {
      token: true,
    },
  });

  const token = {
    token: findToken.token,
  };

  return token;
};

export { loginAdminService };
