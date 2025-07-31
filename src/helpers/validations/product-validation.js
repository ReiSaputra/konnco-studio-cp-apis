import joi from "joi";

const productIdSchema = joi.number().min(1).required();

export { productIdSchema };
