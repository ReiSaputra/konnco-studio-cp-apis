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
      lengthOfService: joi.number().max(100).optional().positive(),
    })
    .optional(),
  message: joi.string().max(3000).required(),
  fileName: joi
    .string()
    // .pattern(/\.pdf$/i)
    .required(),
  skills: joi.array().items(joi.string()).min(1).required(),
  careerId: joi.number().required(),
});

export { careerSchema, careerApplicationSchema };
