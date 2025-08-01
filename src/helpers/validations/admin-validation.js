import joi from "joi";

const authSchema = joi.object({
  email: joi
    .string()
    .email()
    .pattern(/^[^@]+@konnco\.com$/)
    .max(255)
    .required()
    .messages({
      "string.pattern.base": "Email must use @konnco.com",
    }),
  password: joi.string().max(255).required(),
});

const adminSchema = joi.object({});

const getAdminBlogSchema = joi.object({
  page: joi.number().integer().min(1).default(1),
  search: joi.string().allow("").max(255).optional(),
  category: joi.string().allow("").valid("tech", "business", "news", "tutorial", "other").optional().insensitive(),
  status: joi.string().valid("visible", "not-visible").optional(),
});

const blogSlugSchema = joi.string().required();

const blogSchema = joi
  .object({
    title: joi.string().max(255).required(),
    content: joi.string().min(100).max(10000).required(),
    photo: joi.string().required(),
    type: joi.string().valid("TECH", "BUSINESS", "NEWS", "TUTORIAL", "OTHER").required(),
    authorId: joi.string().required(),
    slug: joi.string().required(),
  })
  .required();

const careerSchema = joi.object({
  title: joi.string().max(255).required(),
  description: joi.string().max(1000).required(),
  salary: joi.string().required(),
  requirements: joi.array().items(joi.string()).min(1).required(),
  type: joi.string().valid("UI_UX", "WEB", "MOBILE", "DESKTOP", "SYSTEM_ANALYST", "QUALITY_ASSURANCE", "DATA_ANALYST", "GENERAL_AFFAIR", "MARKETING", "ACCOUNTING").required(),
  linkedInInfo: joi.string().optional(),
  jobStreetInfo: joi.string().optional(),
  glintsInfo: joi.string().optional(),
  tags: joi.array().items(joi.string()).min(1).required(),
});

const careerIdSchema = joi.number().required();
const applicationIdSchema = joi.string().required();

const getCareerApplicationSchema = joi.object({
  page: joi.number().integer().min(1).default(1),
  search: joi.string().allow("").max(255).optional(),
  startDate: joi.date().optional(),
  endDate: joi.date().optional(),
});

const productSchema = joi
  .object({
    title: joi.string().max(255).required(),
    description: joi.string().min(100).required(),
    mainFeature: joi.string().required(),
    advantage: joi.string().required(),
    mainPhoto: joi.string().required(),
  })
  .required();

const inquiryIdSchema = joi.string().required();

const getInquirySchema = joi.object({
  page: joi.number().integer().min(1).default(1),
  search: joi.string().allow("").max(255).optional(),
  startDate: joi.date().optional(),
  endDate: joi.date().optional(),
});

export { authSchema, getAdminBlogSchema, blogSlugSchema, blogSchema, careerSchema, careerIdSchema, getCareerApplicationSchema, applicationIdSchema, productSchema, inquiryIdSchema, getInquirySchema };
