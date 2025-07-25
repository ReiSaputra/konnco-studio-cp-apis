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

export { authSchema, getAdminBlogSchema };
