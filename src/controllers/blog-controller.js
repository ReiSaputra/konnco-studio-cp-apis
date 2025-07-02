import { createBlogService } from "../services/blog-service.js";

const createBlogController = async (req, res, next) => {
  try {
    const reqBody = req.body;

    const data = await createBlogService(reqBody);

    return res.status(200).json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export { createBlogController };
