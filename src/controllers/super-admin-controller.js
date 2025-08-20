import { adminPermissionBlogSchema, adminSchema } from "../helpers/validations/super-admin-validation.js";
import { validate } from "../helpers/validations/validate.js";
import { createAdminService, deleteAdminService, getAdminDetailService, getAdminService, updateAdminPermissionBlogService, updateAdminService } from "../services/super-admin-service.js";

const getAdminController = async (req, res, next) => {
  try {
    const user = req.user;
    const { page, search, role } = req.query;

    const { data, pagination } = await getAdminService(user.role, user.permissions, parseInt(page) || 1, search, role);

    return res.status(200).json({
      message: "Successfully get all admins",
      data,
      pagination,
      user: {
        id: user.id,
        user: user.name,
        role: user.role,
        permissions: {
          canShowAdmin: user.permissions.canShowAdmin,
          canViewAdmin: user.permissions.canViewAdmin,
          canCreateAdmin: user.permissions.canCreateAdmin,
          canUpdateAdmin: user.permissions.canUpdateAdmin,
          canDeleteAdmin: user.permissions.canDeleteAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminDetailController = async (req, res, next) => {
  try {
    const user = req.user;
    const { adminId } = req.params;

    const data = await getAdminDetailService(user.role, user.permissions, adminId);

    return res.status(200).json({
      message: "Successfully get admin detail",
      data: data,
      user: {
        id: user.id,
        user: user.name,
        role: user.role,
        permissions: {
          canViewAdmin: user.permissions.canViewAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const createAdminController = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;

    validate(adminSchema, request);

    const data = await createAdminService(user.role, user.permissions, request.name, request.email, request.role, request.phoneNumber);

    return res.status(201).json({
      message: "Successfully created admin",
      data: data,
      user: {
        id: user.id,
        user: user.name,
        role: user.role,
        permissions: {
          canCreateAdmin: user.permissions.canCreateAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminController = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const { adminId } = req.params;

    validate(adminSchema, request);

    const data = await updateAdminService(user.role, user.permissions, adminId, request);

    return res.status(200).json({
      message: "Successfully updated admin",
      data: data,
      user: {
        id: user.id,
        user: user.name,
        role: user.role,
        permissions: {
          canUpdateAdmin: user.permissions.canUpdateAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdminController = async (req, res, next) => {
  const user = req.user;
  const { adminId } = req.params;

  try {
    const data = await deleteAdminService(user.role, user.permissions, adminId);
    
    return res.status(200).json({
      message: "Successfully deleted admin",
      data: data,
      user: {
        id: user.id,
        user: user.name,
        role: user.role,
        permissions: {
          canDeleteAdmin: user.permissions.canDeleteAdmin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminPermissionBlogController = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const { userId } = req.params;

    validate(adminPermissionBlogSchema, { ...request, userId });

    const data = await updateAdminPermissionBlogService(user.role, user.permissions, userId, request);

    return res.status(201).json({
      message: "Successfully updated admin blog permission",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdminPermissionProductController = async () => {
  try {
    const user = req.user;
    const request = req.body;

    validate(adminPermissionProductSchema, request); //buat besok
  } catch (error) {
    next(error);
  }
};

export { getAdminController, getAdminDetailController, createAdminController, updateAdminController, deleteAdminController, updateAdminPermissionBlogController };
