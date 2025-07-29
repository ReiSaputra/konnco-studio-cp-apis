import express from "express";

import { getBlogController, getBlogDetailController } from "../controllers/blog-controller.js";

const blogRoute = express.Router();

blogRoute.get("/blogs", getBlogController);
blogRoute.get("/blogs/:blogSlug", getBlogDetailController);


export { blogRoute };
