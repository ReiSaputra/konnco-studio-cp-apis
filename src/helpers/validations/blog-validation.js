import joi from "joi";

const blogSchema = joi
  .object({
    title: joi.string().required(),
    description: joi.string().min(100).required(),
  })
  .required();

export { blogSchema };
