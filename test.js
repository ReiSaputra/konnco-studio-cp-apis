import bcrypt from "bcrypt";
import { prisma } from "./src/database.js";

await prisma.adminPermission.deleteMany();
await prisma.admin.deleteMany();

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);

  return hash;
}

const createAdmin = await prisma.admin.create({
  data: {
    email: "xl6d5@konnco.com",
    password: await hashPassword("dontknowityet"),
    name: "Admin A",
    phoneNumber: "087323322523",
    role: "ADMIN",
    permissions: {
      create: {},
    },
  },
});

console.info(createAdmin);

const findToken = await prisma.admin.findUnique({
  where: {
    email: "xl6d5@konnco.com",
  },
  select: {
    id: true,
    name: true,
    role: true,
    permissions: {
      select: {
        canViewBlog: true,
        canUpdateBlog: true,
        canDeleteBlog: true,
        can
      },
    },
  },
});

console.info(findToken);
