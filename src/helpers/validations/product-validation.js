import joi from "joi";

const productIdSchema = joi.number().required();

export { productIdSchema };
