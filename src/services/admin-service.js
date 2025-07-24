import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import "dotenv/config";

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

  const tokenEncrypt = CryptoJS.AES.encrypt(JSON.stringify(payload), process.env.SECRET_KEY).toString();

  await prisma.admin.update({
    where: { id: findData.id },
    data: { token: tokenEncrypt },
  });

  return { token: tokenEncrypt };
};

const dashboardAdminService = async (id, role, permissions) => {
  let countBlogData = null;
  let countApplicationData = null;

  let findBlogDatas = null;
  let findAdminDatas = null;
  let findApplicationDatas = null;

  if (role === "ADMIN") {
    countBlogData = await prisma.blog.count({
      where: {
        authorId: id,
      },
    });

    countApplicationData = await prisma.application.count();
    if (permissions.canShowBlog) {
      findBlogDatas = await prisma.blog.findMany({
        where: {
          authorId: id,
        },
        select: {
          title: true,
          slug: true,
          type: true,
          author: {
            select: {
              name: true,
            },
          },
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    if (permissions.canShowAdmin) {
      findAdminDatas = await prisma.admin.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        take: 4,
        orderBy: {
          name: "asc",
        },
      });
    }

    if (permissions.canShowApplication) {
      findApplicationDatas = await prisma.application.findMany({
        select: {
          id: true,
          applicantName: true,
          career: {
            select: {
              title: true,
            },
          },
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  }

  return {
    findBlogData: findBlogDatas,
    findAdminData: findAdminDatas,
    findApplicationData: findApplicationDatas,
    countBlogData: countBlogData,
    countApplicationData: countApplicationData,
  };
};

const getAdminBlogsService = async (id, role, permissions, page, search, filter) => {
  let findBlogDatas = null;

  const offset = (parseInt(page) - 1) * 10;

  if (role === "ADMIN") {
    if (permissions.canShowBlog) {
      const where = {
        authorId: id,
      };

      if (search) {
        where.name = {
          contains: search,
          mode: "insensitive",
        };
      }

      

      findBlogDatas = await prisma.blog.findMany({
        where: {
          authorId: id,
        },
        skip: offset,
        take: 10,
        select: {
          title: true,
          content: true,
          slug: true,
          type: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  }
};

export { loginAdminService, dashboardAdminService, getAdminBlogsService };
