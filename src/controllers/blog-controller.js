import { blogSlugSchema } from "../helpers/validations/blog-validation.js";
import { validate } from "../helpers/validations/validate.js";
import { getBlogService, getBlogDetailService } from "../services/blog-service.js";

const getBlogController = async (req, res, next) => {
  try {
    const data = await getBlogService();

    return res.status(200).json({
      message: "Successfully get blogs",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogDetailController = async (req, res, next) => {
  try {
    const { blogSlug } = req.params;

    validate(blogSlugSchema, blogSlug);

    const data = await getBlogDetailService(blogSlug);

    return res.status(200).json({
      message: "Successfully get blog detail",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export { getBlogController, getBlogDetailController };
