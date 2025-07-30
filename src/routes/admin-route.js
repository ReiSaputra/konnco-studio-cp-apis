import express from "express";
import {
  loginAdminController,
  dashboardAdminController,
  getAdminBlogController,
  getAdminBlogDetailController,
  editAdminBlogDetailController,
  createAdminBlogController,
  deleteAdminBlogDetailController,
  createAdminCareerController,
  deleteAdminCareerDetailController,
  editAdminCareerDetailController,
  getAdminCareerDetailController,
  getAdminCareerController,
  getAdminCareerApplicationController,
  getAdminCareerApplicationDetailController,
  deleteAdminCareerApplicationDetailController,
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
adminRoute.delete("/admins/blogs/:blogSlug", authMiddleware, deleteAdminBlogDetailController);

// Careers
adminRoute.get("/admins/careers", authMiddleware, getAdminCareerController);
adminRoute.get("/admins/careers/:careerId", authMiddleware, getAdminCareerDetailController);
adminRoute.put("/admins/careers/:careerId", authMiddleware, editAdminCareerDetailController);
adminRoute.post("/admins/careers", authMiddleware, createAdminCareerController);
adminRoute.delete("/admins/careers/:careerId", authMiddleware, deleteAdminCareerDetailController);

// Careers Applications
adminRoute.get("/admins/careers/applications", authMiddleware, getAdminCareerApplicationController);
// adminRoute.get("/admins/careers/:careerId/applications/:applicationId", authMiddleware, getAdminCareerApplicationDetailController);
// adminRoute.delete("/admins/careers/:careerId/applications/:applicationId", authMiddleware, deleteAdminCareerApplicationDetailController);

// Products

/**
 * adminRoute.get("/admins/products", authMiddleware);
 * adminRoute.get("/admins/products/:productId", authMiddleware);
 * adminRoute.put("/admins/products/:productId", authMiddleware);
 * adminRoute.post("/admins/products", authMiddleware);
 * adminRoute.delete("/admins/products/:productId", authMiddleware);
 */

// Inquiries

/**
 * adminRoute.get("/admins/inquiries", authMiddleware);
 * adminRoute.get("/admins/inquiries/:inquiryId", authMiddleware);
 * adminRoute.delete("admin/inquiries/:inquiryId", authMiddleware);
 */

export { adminRoute };
