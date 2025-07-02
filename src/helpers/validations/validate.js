import { ValidationError } from "../class/validation-error";

const validate = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) throw new ValidationError(error.message, 400);

  return true;
};

export { validate };
