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
    title: joi.string().required(),
    content: joi.string().min(100).max(1000).required(),
    photo: joi.string().required(),
    type: joi.string().valid("TECH", "BUSINESS", "NEWS", "TUTORIAL", "OTHER").required(),
    authorId: joi.number().required(),
    slug: joi.string().required(),
  })
  .required();

export { authSchema, getAdminBlogSchema, blogSlugSchema, blogSchema };
