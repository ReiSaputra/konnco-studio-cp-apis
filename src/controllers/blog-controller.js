import { blogSlugSchema } from "../helpers/validations/blog-validation.js";
import { validate } from "../helpers/validations/validate.js";
import { getBlogService, getBlogDetailService } from "../services/blog-service.js";

// const createBlogController = async (req, res, next) => {
//   try {
//     const { title, description, authorId } = req.body;

//     validate(blogSchema, { title, description });

//     if (!req.file) {
//       return res.status(400).json({ message: "photo file is required" });
//     }

//     const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

//     const data = await createBlogService(title, description, authorId, imagePath);

//     return res.status(200).json({
//       message: "Success",
//       data,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

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
