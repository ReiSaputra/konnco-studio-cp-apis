import { prisma } from "../../src/database.js";
import bcrypt from "bcrypt";

await prisma.blog.deleteMany();
await prisma.adminPermission.deleteMany();
await prisma.admin.deleteMany();

const adminLogin = async () => {
  await prisma.admin.create({
    data: {
      email: "xl5d5@konnco.com",
      password: await bcrypt.hash("dontknowityet", 10),
      name: "Admin A",
      phoneNumber: "087823322523",
      role: "ADMIN",
      permissions: {
        create: {
          canShowApplication: true,
          canCreateApplication: true,
          canViewApplication: true,
          canUpdateApplication: true,
          canDeleteApplication: true,

          canShowCareer: true,
          canCreateCareer: true,
          canViewCareer: true,
          canUpdateCareer: true,
          canDeleteCareer: true,

          canShowProduct: true,
          canCreateProduct: true,
          canViewProduct: true,
          canUpdateProduct: true,
          canDeleteProduct: true,

          canShowBlog: true,
          canCreateBlog: true,
          canViewBlog: true,
          canUpdateBlog: true,
          canDeleteBlog: true,

          canShowAdmin: true,
        },
      },
      blogs: {
        create: {
          title: "Blog A",
          content: "Content A",
          photo: "photosOfA1.jpg",
          type: "TECH",
          slug: "blog-a",
          isVisible: true,
        },
      },
    },
  });
};

adminLogin();
