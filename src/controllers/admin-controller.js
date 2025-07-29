import { FileUploadError } from "../helpers/class/file-upload-error.js";
import { PropertyError } from "../helpers/class/property-error.js";
import { authSchema, blogSchema, blogSlugSchema, careerSchema, getAdminBlogSchema } from "../helpers/validations/admin-validation.js";
import { validate } from "../helpers/validations/validate.js";
import {
  loginAdminService,
  dashboardAdminService,
  getAdminBlogService,
  getAdminBlogDetailService,
  editAdminBlogDetailService,
  createAdminBlogService,
  deleteAdminBlogDetailService,
  createAdminCareerService,
  getAdminCareerService,
} from "../services/admin-service.js";

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
        name: data.name,
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
        permissions: {
          canShowBlog: permissions.canShowBlog,
          canViewBlog: permissions.canViewBlog,
          canUpdateBlog: permissions.canUpdateBlog,
          canDeleteBlog: permissions.canDeleteBlog,

          canShowAdmin: permissions.canShowAdmin,
          canViewAdmin: permissions.canViewAdmin,

          canShowApplication: permissions.canShowApplication,
          canViewApplication: permissions.canViewApplication,
        },
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

    validate(getAdminBlogSchema, { page, search, category, status });

    const data = await getAdminBlogService(id, role, permissions, parseInt(page) || 1, search, category, status);

    return res.status(200).json({
      message: "Successfully get admin blogs",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canShowBlog: permissions.canShowBlog,
          canViewBlog: permissions.canViewBlog,
          canCreateBlog: permissions.canCreateBlog,
          canUpdateBlog: permissions.canUpdateBlog,
          canDeleteBlog: permissions.canDeleteBlog,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminBlogDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { blogSlug } = req.params;

    validate(blogSlugSchema, blogSlug);

    const data = await getAdminBlogDetailService(role, permissions, blogSlug);

    return res.status(200).json({
      message: "Successfully get admin blog detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canViewBlog: permissions.canViewBlog,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const editAdminBlogDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { title, content, type, authorId, slug } = req.body;
    const photo = req.file;
    const { blogSlug } = req.params;

    if (!title) throw new PropertyError("Title is required");
    if (!content) throw new PropertyError("Content is required");
    if (!type) throw new PropertyError("Type is required");
    if (!authorId) throw new PropertyError("Author id is required");
    if (!slug) throw new PropertyError("Slug is required");
    if (!photo) throw new FileUploadError("Either File is required or File Mime Type is not PDF");

    const photoName = photo.filename;

    validate(blogSlugSchema, blogSlug);
    validate(blogSchema, { title, content, photo: photoName, type, authorId, slug });

    const data = await editAdminBlogDetailService(role, permissions, blogSlug, title, content, photoName, type, authorId, slug);

    return res.status(200).json({
      message: "Successfully update admin blog detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canUpdateBlog: permissions.canUpdateBlog,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const createAdminBlogController = async (req, res, next) => {
  const { id, name, role, permissions } = req.user;
  const { title, content, type, authorId, slug } = req.body;
  const photo = req.file;

  if (!title) throw new PropertyError("Title is required");
  if (!content) throw new PropertyError("Content is required");
  if (!type) throw new PropertyError("Type is required");
  if (!authorId) throw new PropertyError("Author id is required");
  if (!slug) throw new PropertyError("Slug is required");
  if (!photo) throw new FileUploadError("Either Photo is required or File Mime Type is not PDF");

  const photoName = photo.filename;

  validate(blogSchema, { title, content, photo: photoName, type, authorId, slug });

  const data = await createAdminBlogService(role, permissions, title, content, photoName, type, authorId, slug);

  return res.status(200).json({
    message: "Successfully create admin blog",
    data: data,
    user: {
      id,
      name,
      role,
      permissions: {
        canCreateBlog: permissions.canCreateBlog,
      },
    },
  });
};

const deleteAdminBlogDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { blogSlug } = req.params;

    validate(blogSlugSchema, blogSlug);

    const data = await deleteAdminBlogDetailService(role, permissions, blogSlug);

    return res.status(200).json({
      message: "Successfully delete admin blog detail",
      user: {
        id,
        name,
        role,
        permissions: {
          canDeleteBlog: permissions.canDeleteBlog,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminCareerController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;

    const data = await getAdminCareerService(id, role, permissions);

    return res.status(200).json({
      message: "Successfully get admin careers",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canShowCareer: permissions.canShowCareer,
          canViewCareer: permissions.canViewCareer,
          canCreateCareer: permissions.canCreateCareer,
          canUpdateCareer: permissions.canUpdateCareer,
          canDeleteCareer: permissions.canDeleteCareer,
        },
      },
    })
  } catch (error) {
    next(error);
  }
};

const getAdminCareerDetailController = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const editAdminCareerDetailController = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const createAdminCareerController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { title, description, salary, requirements, type, linkedInInfo, jobStreetInfo, glintsInfo, tags } = req.body;

    if (!title) throw new PropertyError("Title is required");
    if (!description) throw new PropertyError("Description is required");
    if (!salary) throw new PropertyError("Salary is required");
    if (!requirements) throw new PropertyError("Requirements is required");
    if (!type) throw new PropertyError("Type is required");
    if (!tags) throw new PropertyError("Tags is required");

    validate(careerSchema, { title, description, salary, requirements, type, linkedInInfo, jobStreetInfo, glintsInfo, tags });

    const data = await createAdminCareerService(id, role, permissions, title, description, salary, requirements, type, linkedInInfo, jobStreetInfo, glintsInfo, tags);

    return res.status(200).json({
      message: "Successfully create admin career",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canCreateCareer: permissions.canCreateCareer,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdminCareerDetailController = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export {
  loginAdminController,
  dashboardAdminController,
  getAdminBlogController,
  getAdminBlogDetailController,
  editAdminBlogDetailController,
  createAdminBlogController,
  deleteAdminBlogDetailController,
  getAdminCareerController,
  getAdminCareerDetailController,
  editAdminCareerDetailController,
  createAdminCareerController,
  deleteAdminCareerDetailController,
};
