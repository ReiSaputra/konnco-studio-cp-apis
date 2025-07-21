import express from "express";

import {
  createBlogController,
  getBlogController,
  getBlogDetailController,
} from "../controllers/blog-controller.js";

import { upload } from "../middlewares/upload-middleware.js";

import { authMiddleware } from "../middlewares/auth-middleware.js";

const blogRoute = express.Router();

// Public routes
blogRoute.get("/blogs", getBlogController);
blogRoute.get("/blogs/:blogId", getBlogDetailController);

// Protected route (hanya admin bisa buat blog)
// blogRoute.post("/blogs", authMiddleware, upload.single("photo"), createBlogController);

blogRoute.post("/blogs", upload.single("photo"), createBlogController);

export { blogRoute };
