import joi from "joi";

const adminSchema = joi.object({
  name: joi.string().max(255).required(),
  email: joi
    .string()
    .email()
    .pattern(/^[^@]+@konnco\.com$/)
    .max(255)
    .required()
    .messages({
      "string.pattern.base": "Email must use @konnco.com",
    }),
  role: joi.string().valid("ADMIN", "SUPER_ADMIN").required(),
  phoneNumber: joi.string().max(255).required(),
});

const adminPermissionBlogSchema = joi.object({
  userId: joi.string().required(),
  canShowBlog: joi.boolean().required(),
  canViewBlog: joi.boolean().required(),
  canCreateBlog: joi.boolean().required(),
  canUpdateBlog: joi.boolean().required(),
  canDeleteBlog: joi.boolean().required(),
});

const adminPermissionCareerSchema = joi.object({
  canShowCareer: joi.boolean().required(),
  canViewCareer: joi.boolean().required(),
  canCreateCareer: joi.boolean().required(),
  canUpdateCareer: joi.boolean().required(),
  canDeleteCareer: joi.boolean().required(),
});

export { adminSchema, adminPermissionBlogSchema, adminPermissionCareerSchema };
