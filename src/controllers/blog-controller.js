import { blogSchema } from "../helpers/validations/blog-validation.js";
import { validate } from "../helpers/validations/validate.js";
import {
  createBlogService,
  getBlogService,
  getBlogDetailService,
} from "../services/blog-service.js";

const createBlogController = async (req, res, next) => {
  try {
    const { title, description, authorId } = req.body;

    validate(blogSchema, { title, description });

    if (!req.file){
      return res.status(400).json({ message: "photo file is required"});
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const data = await createBlogService(title, description, authorId, imagePath);

    return res.status(200).json({
      message: "Success",
      data,
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
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogDetailController = async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const data = await getBlogDetailService(blogId);

    if (!data) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createBlogController,
  getBlogController,
  getBlogDetailController,
};
