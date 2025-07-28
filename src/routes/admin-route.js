import express from "express";
import {
  loginAdminController,
  dashboardAdminController,
  getAdminBlogController,
  getAdminBlogDetailController,
  editAdminBlogDetailController,
  createAdminBlogController,
  deleteAdminBlogDetailController,
} from "../controllers/admin-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import fs from "fs";
import { createMulterUpload } from "../middlewares/upload-middleware.js";

const path = "public/blogs";

if (!fs.existsSync(path)) {
  fs.mkdirSync(path, { recursive: true });
}

const adminRoute = express.Router();

const upload = createMulterUpload(path, 2, "image/jpeg");

// Auth
adminRoute.post("/admins/auth/login", loginAdminController);

// Dashboard
adminRoute.get("/admins/dashboard/overview", authMiddleware, dashboardAdminController);

// Blogs
adminRoute.get("/admins/blogs", authMiddleware, getAdminBlogController);
adminRoute.get("/admins/blogs/:blogSlug", authMiddleware, getAdminBlogDetailController);
adminRoute.put("/admins/blogs/:blogSlug", authMiddleware, upload.single("photo"), editAdminBlogDetailController);
adminRoute.post("/admins/blogs", authMiddleware, upload.single("photo"), createAdminBlogController);
// adminRoute.delete("/admins/blogs/:blogSlug", authMiddleware, deleteAdminBlogDetailController);

// Careers

// Products

// Inquiries

export { adminRoute };
