import express from "express";

import { createBlogController, getBlogController, getBlogDetailController } from "../controllers/blog-controller.js";

import { upload } from "../middlewares/upload-middleware.js";

import { authMiddleware } from "../middlewares/auth-middleware.js";

const blogRoute = express.Router();

blogRoute.get("/blogs", getBlogController);
blogRoute.get("/blogs/:blogSlug", getBlogDetailController);

blogRoute.post("/blogs", upload.single("photo"), createBlogController);

export { blogRoute };
