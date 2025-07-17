import joi from "joi";

const inquirySchema = joi.object({
  senderName: joi.string().max(255).required(),
  email: joi.string().email().max(255).required(),
  subject: joi.string().max(255).required(),
  message: joi.string().required(),
});

export { inquirySchema };

