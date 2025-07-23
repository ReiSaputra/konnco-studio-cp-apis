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

export { authSchema };
