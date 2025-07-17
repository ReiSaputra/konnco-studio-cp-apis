import joi from "joi";
import { validate } from "./validate.js";

const blogValidation = joi
  .object({
    title: joi.string().required(),
    description: joi.string().min(100).required(),
  })
  .required();

export { blogValidation };
