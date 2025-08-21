import { prisma } from "../database.js";
import bcrypt from "bcrypt";

const getAdminService = async (role, permissions, page, search, searchRole) => {
  let getAdmin = null;
  let countData = null;

  const offset = (page - 1) * 10;

  if (role === "SUPER_ADMIN") {
    if (permissions.canShowAdmin) {
      const where = {};

      if (search) {
        where.name = { contains: search };
      }

      if (role) {
        where.role = searchRole;
      }

      getAdmin = await prisma.admin.findMany({
        where,
        skip: offset,
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phoneNumber: true,
        },
      });

      countData = await prisma.admin.count({
        where,
      });
    } else {
      throw new Error("You don't have permission to view admin");
    }
  } else {
    throw new Error("You don't have permission to view admin");
  }

  return {
    data: getAdmin,
    pagination: {
      totalData: countData,
      currentPage: page,
      perPage: 10,
      totalPage: Math.ceil(countData / 10),
    },
  };
};

const getAdminDetailService = async (role, permissions, adminId) => {
  let findAdminData = null;

  if (role === "SUPER_ADMIN") {
    if (permissions.canViewAdmin) {
      findAdminData = await prisma.admin.findUnique({
        where: {
          id: adminId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
          phoneNumber: true,
        },
      });

      if (!findAdminData) throw new Error("Admin not found");
    } else {
      throw new Error("You don't have permission to view admin detail");
    }
  } else {
    throw new Error("You don't have permission to view admin detail");
  }

  let passwordCensored = "";

  for (let index = 0; index < findAdminData.password.length; index++) {
    passwordCensored += "*";
  }

  findAdminData.password = passwordCensored;

  return findAdminData;
};

const updateAdminService = async (role, permissions, adminId, request) => {
  let updateAdmin = null;

  if (role === "SUPER_ADMIN") {
    if (permissions.canUpdateAdmin) {
      const findAdmin = await prisma.admin.findUnique({
        where: {
          id: adminId,
        },
      });

      if (!findAdmin) throw new Error("Admin not found");

      const findAdminEmail = await prisma.admin.findUnique({
        where: { email: request.email },
      });

      if (findAdminEmail && findAdminEmail.id !== adminId) {
        throw new Error("Email Admin already exist");
      }

      const findAdminPhoneNumber = await prisma.admin.findUnique({
        where: { phoneNumber: request.phoneNumber },
      });

      if (findAdminPhoneNumber && findAdminPhoneNumber.id !== adminId) {
        throw new Error("Phone Number Admin already exist");
      }

      updateAdmin = await prisma.admin.update({
        where: {
          id: adminId,
        },
        data: {
          name: request.name,
          email: request.email,
          role: request.role,
          phoneNumber: request.phoneNumber,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phoneNumber: true,
        },
      });
    } else {
      throw new Error("You don't have permission to update admin");
    }
  } else {
    throw new Error("You don't have permission to update admin");
  }

  return updateAdmin;
};

const deleteAdminService = async (role, permissions, adminId) => {
  let deleteAdmin = null;

  if (role === "SUPER_ADMIN") {
    if (permissions.canDeleteAdmin) {
      const findAdmin = await prisma.admin.findUnique({
        where: {
          id: adminId,
        },
      });

      if (!findAdmin) throw new Error("Admin not found");

      deleteAdmin = await prisma.admin.delete({
        where: {
          id: adminId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phoneNumber: true,
        },
      });
    } else {
      throw new Error("You don't have permission to delete admin");
    }
  } else {
    throw new Error("You don't have permission to delete admin");
  }

  return deleteAdmin;
};

const createAdminService = async (role, permissions, name, email, roleUser, phoneNumber) => {
  let createAdmin = null;

  if (role === "SUPER_ADMIN") {
    if (permissions.canCreateAdmin) {
      const findAdminEmail = await prisma.admin.findUnique({
        where: {
          email: email,
        },
      });

      if (findAdminEmail) {
        throw new Error("Email Admin already exist");
      }

      const findAdminPhoneNumber = await prisma.admin.findUnique({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      if (findAdminPhoneNumber) {
        throw new Error("Phone number Admin already exist");
      }

      createAdmin = await prisma.admin.create({
        data: {
          name: name,
          email: email,
          role: roleUser,
          phoneNumber: phoneNumber,
          password: await bcrypt.hash("12345678", 10),
        },
      });
    } else {
      throw new Error("You don't have permission to create admin, lah kok iso");
    }
  } else {
    throw new Error("You don't have permission to create admin");
  }

  return {
    id: createAdmin.id,
    name: createAdmin.name,
    email: createAdmin.email,
    role: createAdmin.role,
    phoneNumber: createAdmin.phoneNumber,
  };
};

const updateAdminPermissionBlogService = async (role, permissions, request) => {
  let updateAdminPermission = null;

  if (role === "SUPER_ADMIN") {
    if (permissions.canUpdateAdmin) {
      const findAdminPermission = await prisma.adminPermission.findUnique({
        where: {
          admin: {
            email: email,
          },
        },
      });

      if (!findAdminPermission) {
        throw new Error("Email Admin already exist");
      }

      updateAdminPermission = await prisma.adminPermission.updateMany({
        where: {
          admin: {
            email: email,
          },
        },
        data: {
          canShowBlog: permissions.canShowBlog,

          canCreateBlog: permissions.canCreateBlog,
          canViewBlog: permissions.canViewBlog,
          canUpdateBlog: permissions.canUpdateBlog,
          canDeleteBlog: permissions.canDeleteBlog,
        },
      });
    } else {
      throw new Error("You don't have permission to update admin");
    }
  } else {
    throw new Error("You don't have permission to update admin");
  }

  return updateAdminPermission;
};

// const updateAdminPermissionsProductService = async (role, permissions) => {};

// const updateAdminPermissionsInquiryService = async (role, permissions) => {};

// const updateAdminPermissionsApplicationService = async (role, permissions) => {};

// const updateAdminPermissionsProfileService = async (role, permissions) => {};

export { getAdminService, getAdminDetailService, deleteAdminService, createAdminService, updateAdminService, updateAdminPermissionBlogService };
