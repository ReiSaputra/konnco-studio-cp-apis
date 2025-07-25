import { PropertyError } from "../helpers/class/property-error.js";
import { authSchema, getAdminBlogSchema } from "../helpers/validations/admin-validation.js";
import { validate } from "../helpers/validations/validate.js";
import { loginAdminService, dashboardAdminService, getAdminBlogService } from "../services/admin-service.js";

const loginAdminController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new PropertyError("Email is required");
    if (!password) throw new PropertyError("Password is required");

    validate(authSchema, { email, password });

    const data = await loginAdminService(email, password);

    return res.status(200).json({
      message: "Successfully login to konnco studio admin panel",
      data: {
        token: data.token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const dashboardAdminController = async (req, res, next) => {
  const { id, name, role, permissions } = req.user;

  try {
    const data = await dashboardAdminService(id, role, permissions);

    return res.status(200).json({
      message: "Successfully get dashboard data",
      data: data,
      user: {
        id,
        name,
        role,
        permissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminBlogController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { page, search, category, status } = req.query;

    if (!page) page = 1;

    validate(getAdminBlogSchema, { page, search, category, status });

    const data = await getAdminBlogService(id, role, permissions, parseInt(page) || 1, search, category, status);

    return res.status(200).json({
      message: "Successfully get admin blogs",
    });
  } catch (error) {
    next(error);
  }
};

const getAdminBlogDetailController = async (req, res, next) => {
  try {
  } catch (error) {}
};

export { loginAdminController, dashboardAdminController, getAdminBlogController, getAdminBlogDetailController };
