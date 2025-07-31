import bcrypt from "bcrypt";
import { prisma } from "../../src/database.js";

const run = async () => {
  const hash = await bcrypt.hash("dontknow", 10);

  await prisma.admin.create({
  data: {
    email: "admin1@konnco.com",
    password: hash,
    name: "Admin 1",
    phoneNumber: "08198765432",
    role: "ADMIN",
    permissions: {
      create: {
        canShowBlog: true,
        canCreateBlog: false,
        canViewBlog: false,
        canUpdateBlog: false,
        canDeleteBlog: false,

        canShowCareer: false,
        canCreateCareer: false,
        canViewCareer: false,
        canUpdateCareer: false,
        canDeleteCareer: false,

        canShowApplication: true,
        canCreateApplication: false,
        canViewApplication: false,
        canUpdateApplication: false,
        canDeleteApplication: false,

        canShowProduct: false,
        canCreateProduct: false,
        canViewProduct: false,
        canUpdateProduct: false,
        canDeleteProduct: false,

        canShowAdmin: true,
        canCreateAdmin: false,
        canViewAdmin: false,
        canUpdateAdmin: false,
        canDeleteAdmin: false,
      },
    },
  },
});


  console.log("Admin created");
};

run();
