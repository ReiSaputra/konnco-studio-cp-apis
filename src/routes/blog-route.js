import express from "express";

import { createBlogController } from "../controllers/blog-controller";

import { authMiddleware } from "../middlewares/auth-middleware";

const blogRoute = express.Router();

blogRoute.get("/blogs");
blogRoute.get("/blogs/:blogId");
blogRoute.post("/blogs", authMiddleware, createBlogController);

export { blogRoute };
