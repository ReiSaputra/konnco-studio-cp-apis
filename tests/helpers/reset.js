import { prisma } from "../../src/database.js";

const resetAllData = async () => {
  await prisma.application.deleteMany();
  await prisma.career.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.adminPermission.deleteMany();
  await prisma.admin.deleteMany();

  console.info("All data has been reset");
};

resetAllData();
