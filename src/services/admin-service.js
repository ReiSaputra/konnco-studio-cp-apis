import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import fs from "fs";
import path from "path";
import "dotenv/config";

import { prisma } from "../database.js";
import { AuthError } from "../helpers/class/auth-error.js";

/**
 * Auth
 */

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

/**
 * Dashboard
 */

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

/**
 * Blogs
 */

const getAdminBlogService = async (id, role, permissions, page, search, category, status) => {
  let findBlogDatas = null;

  const offset = (page - 1) * 10;

  if (role === "ADMIN") {
    if (permissions.canShowBlog) {
      const where = {
        authorId: id,
      };

      if (search) {
        where.title = {
          contains: search,
        };
      }

      if (category) {
        where.type = category.toUpperCase();
      }

      if (status === "visible") {
        where.isVisible = true;
      } else if (status === "not-visible") {
        where.isVisible = false;
      }

      findBlogDatas = await prisma.blog.findMany({
        where,
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
  } else {
    throw new Error("You don't have permission to show blog");
  }

  return findBlogDatas;
};

const getAdminBlogDetailService = async (role, permissions, blogSlug) => {
  let findBlogData = null;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    if (permissions.canShowBlog) {
      findBlogData = await prisma.blog.findUnique({
        where: { slug: blogSlug },
        select: {
          title: true,
          content: true,
          photo: true,
          type: true,
          author: {
            select: { name: true },
          },
          createdAt: true,
        },
      });

      if (!findBlogData) throw new Error("Blog not found");
    } else {
      throw new Error("You don't have permission to view blog");
    }
  }

  return findBlogData;
};

const editAdminBlogDetailService = async (role, permissions, blogSlug, title, content, photoName, type, authorId, slug) => {
  let updateBlogData = null;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    if (permissions.canUpdateBlog) {
      const findBlogData = await prisma.blog.findUnique({
        where: {
          slug: blogSlug,
        },
        select: {
          photo: true,
        },
      });

      if (!findBlogData) throw new Error("Blog not found");

      if (photoName && findBlogData.photo && photoName !== findBlogData.photo) {
        const oldFilePath = path.join("public", "blogs", findBlogData.photo);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      updateBlogData = await prisma.blog.update({
        where: {
          slug: blogSlug,
        },
        data: {
          title: title,
          content: content,
          photo: photoName,
          type: type,
          authorId: authorId,
          slug: slug,
        },
      });

      if (!findBlogData) throw new Error("Blog not found");
    } else {
      throw new Error("You don't have permission to update blog");
    }
  }

  return updateBlogData;
};

const createAdminBlogService = async (role, permissions, title, content, photoName, type, authorId, slug) => {
  let createData = null;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    if (permissions.canCreateBlog) {
      const findData = await prisma.blog.findUnique({
        where: { slug: slug },
      });

      if (findData) throw new Error("Blog Slug already exists");

      createData = await prisma.blog.create({
        data: {
          title: title,
          content: content,
          photo: photoName,
          type: type,
          authorId: authorId,
          slug: slug,
        },
      });

      if (!createData) throw new Error("Failed to create blog");
    } else {
      throw new Error("You don't have permission to create blog");
    }
  }

  return createData;
};

const deleteAdminBlogDetailService = async (role, permissions, blogSlug) => {
  let deleteBlogData = null;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    if (permissions.canDeleteBlog) {
      const findBlogData = await prisma.blog.findUnique({
        where: {
          slug: blogSlug,
        },
        select: {
          slug: true,
        },
      });

      if (!findBlogData) throw new Error("Blog not found");

      deleteBlogData = await prisma.blog.delete({
        where: {
          slug: blogSlug,
        },
      });

      if (!deleteBlogData) throw new Error("Blog not found");
    } else {
      throw new Error("You don't have permission to delete blog");
    }

    if (!deleteBlogData) throw new Error("Blog not found");
  } else {
    throw new Error("You don't have permission to delete blog");
  }

  return deleteBlogData;
};

/**
 * Careers
 */

const getAdminCareerService = async (id, role, permissions) => {
  let findCareerDatas = null;

  if (role === "ADMIN") {
    if (permissions.canShowCareer) {
      findCareerDatas = await prisma.career.findMany({
        where: {
          authorId: id,
        },
        orderBy: {
          title: "asc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          tags: true,
        },
      });
    } else {
      throw new Error("You don't have permission to show admin careers");
    }
  } else if (role === "SUPER_ADMIN") {
    if (permissions.canShowCareer) {
      findCareerDatas = await prisma.career.findMany({
        orderBy: {
          title: "asc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          tags: true,
          author: {
            select: { name: true },
          },
        },
      });
    } else {
      throw new Error("You don't have permission to show admin careers");
    }
  } else {
    throw new Error("You don't have permission to show admin careers");
  }

  return findCareerDatas;
};

const getAdminCareerDetailService = async (role, permissions, careerId) => {
  let findCareerData = null;

  if (role === "ADMIN") {
    if (permissions.canViewCareer) {
      findCareerData = await prisma.career.findUnique({
        where: { id: parseInt(careerId) },
        select: {
          title: true,
          description: true,
          salary: true,
          requirements: true,
          linkedInInfo: true,
          jobStreetInfo: true,
          glintsInfo: true,
          tags: true,
          createdAt: true,
        },
      });
    } else {
      throw new Error("You don't have permission to view admin careers");
    }
  } else if (role === "SUPER_ADMIN") {
    if (permissions.canViewCareer) {
      findCareerData = await prisma.career.findUnique({
        where: { id: parseInt(careerId) },
        select: {
          title: true,
          description: true,
          salary: true,
          requirements: true,
          linkedInInfo: true,
          jobStreetInfo: true,
          glintsInfo: true,
          tags: true,
          author: {
            select: { name: true },
          },
          createdAt: true,
        },
      });
    } else {
      throw new Error("You don't have permission to view admin careers");
    }
  } else {
    throw new Error("You don't have permission to view admin careers");
  }

  if (!findCareerData) throw new Error("Career Detail Data is not found");

  return findCareerData;
};

const editAdminCareerDetailService = async (id, role, permissions, careerId, title, description, salary, requirements, type, linkedInInfo, jobStreetInfo, glintsInfo, tags) => {
  let editData = null;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    if (permissions.canUpdateCareer) {
      const findData = await prisma.career.findUnique({ where: { id: parseInt(careerId) } });

      if (!findData) throw new Error("Career not found");

      const tagEach = tags.map((tag) => tag.trim()).join(", ");
      const requirementEach = requirements.map((requirement) => requirement.trim()).join(", ");

      editData = await prisma.career.update({
        where: {
          id: parseInt(careerId),
        },
        data: {
          title: title,
          description: description,
          salary: salary,
          requirements: requirementEach,
          type: type,
          linkedInInfo: linkedInInfo,
          jobStreetInfo: jobStreetInfo,
          glintsInfo: glintsInfo,
          tags: tagEach,
          authorId: id,
        },
      });
    } else {
      throw new Error("You don't have permission to update admin careers");
    }
  } else {
    throw new Error("You don't have permission to update admin careers");
  }

  return editData;
};

const createAdminCareerService = async (id, role, permissions, title, description, salary, requirements, type, linkedInInfo, jobStreetInfo, glintsInfo, tags) => {
  let createData = null;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    if (permissions.canCreateCareer) {
      const tagEach = tags.map((tag) => tag.trim()).join(", ");
      const requirementEach = requirements.map((requirement) => requirement.trim()).join(", ");

      createData = await prisma.career.create({
        data: {
          title: title,
          description: description,
          salary: salary,
          requirements: requirementEach,
          type: type,
          linkedInInfo: linkedInInfo,
          jobStreetInfo: jobStreetInfo,
          glintsInfo: glintsInfo,
          tags: tagEach,
          authorId: id,
        },
      });

      if (!createData) throw new Error("Failed to create admin career");
    } else {
      throw new Error("You don't have permission to create admin");
    }
  } else {
    throw new Error("You don't have permission to create admin");
  }

  return createData;
};

const deleteAdminCareerDetailService = async (role, permissions, careerId) => {
  let deleteData = null;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    if (permissions.canDeleteCareer) {
      const findData = await prisma.career.findUnique({
        where: {
          id: parseInt(careerId),
        },
      });

      if (!findData) throw new Error("Career not found");

      deleteData = await prisma.career.delete({
        where: {
          id: parseInt(careerId),
        },
      });
    } else {
      throw new Error("You don't have permission to delete admin careers");
    }
  } else {
    throw new Error("You don't have permission to delete admin careers");
  }
};

const getAdminCareerApplicationService = async (id, role, permissions, page, search, startDate, endDate) => {
  let findCareerApplicationDatas;

  const offset = (page - 1) * 10;

  if (role === "ADMIN") {
    if (permissions.canShowApplication) {
      const where = {
        career: {
          authorId: id,
        },
      };

      if (search) where.applicantName = { contains: search };
      if (startDate && endDate) {
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        parsedEndDate.setUTCHours(23, 59, 59, 999);

        where.createdAt = { gte: parsedStartDate, lte: parsedEndDate };
      }

      findCareerApplicationDatas = await prisma.application.findMany({
        where,
        skip: offset,
        take: 10,
        select: {
          applicantName: true,
          createdAt: true,
          career: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      throw new Error("You don't have permission to show admin career applications");
    }
  } else if (role === "SUPER_ADMIN") {
    if (permissions.canShowApplication) {
      const where = {};
      if (search) where.applicantName = { contains: search, mode: "insensitive" };
      if (startDate && endDate) where.createdAt = { gte: startDate, lte: endDate };

      findCareerApplicationDatas = await prisma.career.findMany({
        where,
        skip: offset,
        take: 10,
        select: {
          applications: {
            select: {
              id: true,
              applicantName: true,
              createdAt: true,
              career: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });
    } else {
      throw new Error("You don't have permission to show admin career applications");
    }
  } else {
    throw new Error("You don't have permission to show admin career applications");
  }

  return findCareerApplicationDatas;
};

const getAdminCareerApplicationDetailService = async (role, permissions, careerId, applicationId) => {
  let findCareerApplicationData = null;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    if (permissions.canViewApplication) {
      const findCareerData = await prisma.career.findUnique({
        where: {
          id: parseInt(careerId),
        },
      });

      if (!findCareerData) throw new Error("Career not found");

      findCareerApplicationData = await prisma.application.findUnique({
        where: {
          id: applicationId,
          careerId: parseInt(careerId),
        },
        select: {
          applicantName: true,
          email: true,
          phoneNumber: true,
          letter: true,
          educationType: true,
          instituteName: true,
          companyName: true,
          position: true,
          lengthOfService: true,
          file: true,
          skills: true,
          career: {
            select: {
              title: true,
            },
          },
        },
      });
    } else {
      throw new Error("You don't have permission to view admin career applications");
    }
  } else {
    throw new Error("You don't have permission to view admin career applications");
  }

  return findCareerApplicationData;
};

const deleteAdminCareerApplicationDetailService = async (role, permissions, careerId, applicationId) => {
  let deleteData = null;

  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    if (permissions.canDeleteApplication) {
      const findCareerData = await prisma.career.findUnique({
        where: {
          id: parseInt(careerId),
        },
      });

      if (!findCareerData) throw new Error("Career not found");

      const findApplicationData = await prisma.application.findUnique({
        where: {
          id: applicationId,
        },
      });

      if (!findApplicationData) throw new Error("Application not found");

      deleteData = await prisma.application.delete({
        where: {
          id: applicationId,
          careerId: parseInt(careerId),
        },
      });
    } else {
      throw new Error("You don't have permission to delete admin career applications");
    }
  } else {
    throw new Error("You don't have permission to delete admin career applications");
  }

  return deleteData;
};

/**
 * Products
 */

/**
 * Inquiries
 */

export {
  loginAdminService,
  dashboardAdminService,
  getAdminBlogService,
  getAdminBlogDetailService,
  editAdminBlogDetailService,
  createAdminBlogService,
  deleteAdminBlogDetailService,
  getAdminCareerService,
  getAdminCareerDetailService,
  createAdminCareerService,
  editAdminCareerDetailService,
  deleteAdminCareerDetailService,
  getAdminCareerApplicationService,
  getAdminCareerApplicationDetailService,
  deleteAdminCareerApplicationDetailService,
};
