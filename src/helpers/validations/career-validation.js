import joi from "joi";

const careerSchema = joi.object({});

const careerApplicationSchema = joi.object({
  applicantName: joi.string().max(255).required(),
  email: joi.string().max(255).required(),
  phoneNumber: joi.string().max(255).required(),
  academic: joi
    .object({
      educationLevel: joi.string().valid("SD", "SMP", "SMA", "SMK", "D3", "D4", "S1", "S2", "S3").required(),
      instituteName: joi.string().max(255).required(),
    })
    .required(),
  industry: joi
    .object({
      companyName: joi.string().max(255).optional(),
      position: joi.string().max(255).optional(),
      lengthOfService: joi.string().valid("BELOW_1_YEAR", "ABOVE_1_YEAR").max(255).optional(),
    })
    .optional(),
  message: joi.string().max(3000).required(),
  fileName: joi
    .string()
    .pattern(/\.pdf$/i)
    .required(),
  skillsConvert: joi.array().items(joi.string()).min(1).required(),
});

const careerIdSchema = joi.number().required();
const applicationIdSchema = joi.string().required();

export { careerSchema, careerApplicationSchema, careerIdSchema, applicationIdSchema };
