import joi from "joi";

const blogValidation = joi
  .object({
    title: joi.string().required(),
    content: joi.string().required(),
  })
  .required();

const data = {
  title: "",
  content: null
};

const hasil = blogValidation.validate(data, {
  abortEarly: false,
});

if (hasil.error) {
  console.log(hasil.error.message);
} else {
  console.log(hasil.value);
}

export { blogValidation };
