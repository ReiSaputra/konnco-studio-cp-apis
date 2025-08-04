import { FileUploadError } from "../helpers/class/file-upload-error.js";
import { PropertyError } from "../helpers/class/property-error.js";
import { authSchema, blogSchema, blogSlugSchema, careerSchema, getAdminBlogSchema, getCareerApplicationSchema, getInquirySchema, inquiryIdSchema, productSchema } from "../helpers/validations/admin-validation.js";
import { careerIdSchema, applicationIdSchema } from "../helpers/validations/admin-validation.js";
import { productIdSchema } from "../helpers/validations/product-validation.js";
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
  getAdminCareerDetailService,
  editAdminCareerDetailService,
  deleteAdminCareerDetailService,
  getAdminCareerApplicationService,
  getAdminCareerApplicationDetailService,
  deleteAdminCareerApplicationDetailService,
  getAdminProductService,
  getAdminProductDetailService,
  createAdminProductService,
  getAdminInquiryService,
  getAdminInquiryDetailService,
  deleteAdminInquiryDetailService,
  editAdminProductDetailService,
  deleteAdminProductDetailService,
} from "../services/admin-service.js";

/**
 * Auth
 */

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
        id: data.id,
        token: data.token,
        name: data.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Dashboard
 */

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

/**
 * Blogs
 */

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
    if (!authorId) throw new PropertyError("Author ID is required");
    if (!slug) throw new PropertyError("Slug is required");

    // Validasi photo hanya jika ada file baru
    let photoName = null;
    if (photo) {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedMimeTypes.includes(photo.mimetype)) {
        throw new FileUploadError("Only image files (jpg, png, webp) are allowed");
      }
      photoName = photo.filename;
    }

    validate(blogSlugSchema, blogSlug);

    validate(blogSchema, {
      title,
      content,
      photo: photoName || "",
      type,
      authorId,
      slug,
    });

    const updatedBlog = await editAdminBlogDetailService(role, permissions, blogSlug, title, content, photoName, type, authorId, slug);

    return res.status(200).json({
      message: "Successfully updated blog",
      data: updatedBlog,
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
  if (!photo) throw new FileUploadError("Either Photo is required or File Mime Type is not JPG/JPEG");

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

/**
 * Careers
 */

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
    });
  } catch (error) {
    next(error);
  }
};

const getAdminCareerDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { careerId } = req.params;

    validate(careerIdSchema, careerId);

    const data = await getAdminCareerDetailService(role, permissions, careerId);

    return res.status(200).json({
      message: "Successfully get admin career detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canViewCareer: permissions.canViewCareer,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const editAdminCareerDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { careerId } = req.params;

    const { title, description, salary, requirements, type, linkedInInfo, jobStreetInfo, glintsInfo, tags } = req.body;

    if (!title) throw new PropertyError("Title is required");
    if (!description) throw new PropertyError("Description is required");
    if (!salary) throw new PropertyError("Salary is required");
    if (!requirements) throw new PropertyError("Requirements is required");
    if (!type) throw new PropertyError("Type is required");
    if (!tags) throw new PropertyError("Tags is required");

    validate(careerSchema, { title, description, salary, requirements, type, linkedInInfo, jobStreetInfo, glintsInfo, tags });

    const data = await editAdminCareerDetailService(id, role, permissions, careerId, title, description, salary, requirements, type, linkedInInfo, jobStreetInfo, glintsInfo, tags);

    return res.status(200).json({
      message: "Successfully update admin career detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canUpdateCareer: permissions.canUpdateCareer,
        },
      },
    });
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
    const { id, name, role, permissions } = req.user;
    const { careerId } = req.params;

    validate(careerIdSchema, careerId);

    const data = await deleteAdminCareerDetailService(role, permissions, careerId);

    return res.status(200).json({
      message: "Successfully delete admin career detail",
      user: {
        id,
        name,
        role,
        permissions: {
          canDeleteCareer: permissions.canDeleteCareer,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminCareerApplicationController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { page, search, startDate, endDate } = req.query;

    validate(getCareerApplicationSchema, { page, search, startDate, endDate });

    const data = await getAdminCareerApplicationService(id, role, permissions, page || 1, search, startDate, endDate);

    return res.status(200).json({
      message: "Successfully get admin career applications",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canShowApplication: permissions.canShowApplication,
          canViewApplication: permissions.canViewApplication,
          canDeleteApplication: permissions.canDeleteApplication,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminCareerApplicationDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { careerId, applicationId } = req.params;

    validate(careerIdSchema, careerId);
    validate(applicationIdSchema, applicationId);

    const data = await getAdminCareerApplicationDetailService(role, permissions, careerId, applicationId);

    return res.status(200).json({
      message: "Successfully get admin career application detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canViewApplication: permissions.canViewApplication,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdminCareerApplicationDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { careerId, applicationId } = req.params;

    validate(careerIdSchema, careerId);
    validate(applicationIdSchema, applicationId);

    const data = await deleteAdminCareerApplicationDetailService(role, permissions, careerId, applicationId);

    return res.status(200).json({
      message: "Successfully delete admin career application detail",
      user: {
        id,
        name,
        role,
        permissions: {
          canDeleteApplication: permissions.canDeleteApplication,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Products
 */

const getAdminProductController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;

    const data = await getAdminProductService(role, permissions);

    return res.status(200).json({
      message: "Successfully get admin products",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canShowProduct: permissions.canShowProduct,
          canViewProduct: permissions.canViewProduct,
          canCreateProduct: permissions.canCreateProduct,
          canUpdateProduct: permissions.canUpdateProduct,
          canDeleteProduct: permissions.canDeleteProduct,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminProductDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { productId } = req.params;

    validate(productIdSchema, productId);

    const data = await getAdminProductDetailService(role, permissions, productId);

    return res.status(200).json({
      message: "Successfully get admin product detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canViewProduct: permissions.canViewProduct,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const editAdminProductDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;

    const { productId } = req.params;

    const { title, description, mainFeature, advantage } = req.body;
    const [mainPhoto, secondPhoto, thirdPhoto] = req.files;

    if (!title) throw new PropertyError("Title is required");
    if (!description) throw new PropertyError("Description is required");
    if (!mainFeature) throw new PropertyError("Main Feature is required");
    if (!advantage) throw new PropertyError("Advantage is required");
    if (!mainPhoto) throw new FileUploadError("Either Main Photo is required or File Mime Type is not JPG/JPEG");

    validate(productIdSchema, productId);
    validate(productSchema, { title, description, mainFeature, advantage, mainPhoto: mainPhoto.filename });

    const data = await editAdminProductDetailService(role, permissions, productId, title, description, mainFeature, advantage, mainPhoto?.filename, secondPhoto?.filename, thirdPhoto?.filename);

    return res.status(200).json({
      message: "Successfully edit admin product detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canUpdateProduct: permissions.canUpdateProduct,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const createAdminProductController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;

    const { title, description, mainFeature, advantage } = req.body;
    const [mainPhoto, secondPhoto, thirdPhoto] = req.files;

    if (!title) throw new PropertyError("Title is required");
    if (!description) throw new PropertyError("Description is required");
    if (!mainFeature) throw new PropertyError("Main Feature is required");
    if (!advantage) throw new PropertyError("Advantage is required");
    if (!mainPhoto) throw new FileUploadError("Either Main Photo is required or File Mime Type is not JPG/JPEG");

    validate(productSchema, { title, description, mainFeature, advantage, mainPhoto: mainPhoto.filename });

    const data = await createAdminProductService(role, permissions, title, description, mainFeature, advantage, mainPhoto?.filename, secondPhoto?.filename, thirdPhoto?.filename);

    return res.status(200).json({
      message: "Successfully create admin product",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canCreateProduct: permissions.canCreateProduct,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdminProductDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { productId } = req.params;

    validate(productIdSchema, productId);

    const data = await deleteAdminProductDetailService(role, permissions, productId);

    return res.status(200).json({
      message: "Successfully delete admin product detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canDeleteProduct: permissions.canDeleteProduct,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Inquiries
 */

const getAdminInquiryController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { page, search, startDate, endDate } = req.query;

    validate(getInquirySchema, { page, search, startDate, endDate });

    const { data, pagination } = await getAdminInquiryService(role, permissions, page || 1, search, startDate, endDate);
    return res.status(200).json({
      message: "Successfully get admin inquiries",
      data,
      pagination,
      user: {
        id,
        name,
        role,
        permissions: {
          canShowInquiry: permissions.canShowInquiry,
          canViewInquiry: permissions.canViewInquiry,
          canDeleteInquiry: permissions.canDeleteInquiry,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAdminInquiryDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { inquiryId } = req.params;

    validate(inquiryIdSchema, inquiryId);

    const data = await getAdminInquiryDetailService(role, permissions, inquiryId);

    return res.status(200).json({
      message: "Successfully get admin inquiry detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canViewInquiry: permissions.canViewInquiry,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdminInquiryDetailController = async (req, res, next) => {
  try {
    const { id, name, role, permissions } = req.user;
    const { inquiryId } = req.params;

    validate(inquiryIdSchema, inquiryId);

    const data = await deleteAdminInquiryDetailService(role, permissions, inquiryId);

    return res.status(200).json({
      message: "Successfully delete admin inquiry detail",
      data: data,
      user: {
        id,
        name,
        role,
        permissions: {
          canDeleteInquiry: permissions.canDeleteInquiry,
        },
      },
    });
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
  getAdminCareerApplicationController,
  getAdminCareerApplicationDetailController,
  deleteAdminCareerApplicationDetailController,
  getAdminProductController,
  getAdminProductDetailController,
  editAdminProductDetailController,
  createAdminProductController,
  deleteAdminProductDetailController,
  getAdminInquiryController,
  getAdminInquiryDetailController,
  deleteAdminInquiryDetailController,
};
