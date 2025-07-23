import joi from "joi";

const blogSlugSchema = joi.string().required();

const blogSchema = joi
  .object({
    title: joi.string().required(),
    description: joi.string().min(100).required(),
  })
  .required();

export { blogSchema, blogSlugSchema };
