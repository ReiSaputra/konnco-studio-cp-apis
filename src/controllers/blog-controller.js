import { blogSchema } from "../helpers/validations/blog-validation.js";
import { validate } from "../helpers/validations/validate.js";
import { createBlogService, getBlogService, getBlogDetailService } from "../services/blog-service.js";

const createBlogController = async (req, res, next) => {
  try {
    const { title, description, authorId } = req.body;

    validate(blogSchema, { title, content });

    const data = await createBlogService(title, description, authorId);

    return res.status(200).json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogController = async (req, res, next) => {
  try {
    const data = await getBlogService();

    return res.status(200).json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogDetailController = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const data = await getBlogDetailService(blogId);
  } catch (error) {
    next(error);
  }
};

export { createBlogController };
