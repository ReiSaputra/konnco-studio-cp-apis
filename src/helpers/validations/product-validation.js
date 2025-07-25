import joi from "joi";

const productIdSchema = joi.string().required();

export { productIdSchema };
