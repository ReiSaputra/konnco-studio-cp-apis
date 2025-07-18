import joi from "joi";

const careerSchema = joi.object({
  applicantName: joi.string().required(),
  email: joi.string().required(),
  phoneNumber: joi.string().required(),
  academic: joi
    .object({
      educationLevel: joi.string().required(),
      instituteName: joi.string().required(),
    })
    .required(),
  industry: joi
    .object({
      companyName: joi.string().max(255).optional(),
      position: joi.string().max(255).optional(),
      lengthOfService: joi.number().max(255).optional(),
    })
    .optional(),
  message: joi.string().required(),
  file: joi.string().required(),
});
