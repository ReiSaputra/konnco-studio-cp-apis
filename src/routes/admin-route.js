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
  getAdminProductController,
  getAdminProductDetailController,
  editAdminProductDetailController,
  createAdminProductController,
  deleteAdminProductDetailController,
  getAdminInquiryController,
  getAdminInquiryDetailController,
  deleteAdminInquiryDetailController,
} from "../controllers/admin-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import fs from "fs";
import { createMulterUpload } from "../middlewares/upload-middleware.js";

const pathBlogs = "public/blogs";
const pathProducts = "public/products";

if (!fs.existsSync(pathBlogs)) {
  fs.mkdirSync(pathBlogs, { recursive: true });
}

if (!fs.existsSync(pathProducts)) {
  fs.mkdirSync(pathProducts, { recursive: true });
}

const adminRoute = express.Router();

const uploadBlog = createMulterUpload(pathBlogs, 2, "image/jpeg");
const uploadProduct = createMulterUpload(pathProducts, 2, "image/jpeg");

/**
 * Auth
 */

adminRoute.post("/admins/auth/login", loginAdminController);

/**
 * Dashboard
 */

adminRoute.get("/admins/dashboard/overview", authMiddleware, dashboardAdminController);

/**
 * Blogs
 */

adminRoute.get("/admins/blogs", authMiddleware, getAdminBlogController);
adminRoute.get("/admins/blogs/:blogSlug", authMiddleware, getAdminBlogDetailController);
adminRoute.put("/admins/blogs/:blogSlug", authMiddleware, uploadBlog.single("photo"), editAdminBlogDetailController);
adminRoute.post("/admins/blogs", authMiddleware, uploadBlog.single("photo"), createAdminBlogController);
adminRoute.delete("/admins/blogs/:blogSlug", authMiddleware, deleteAdminBlogDetailController);

/**
 * Careers
 */

adminRoute.get("/admins/careers", authMiddleware, getAdminCareerController);
adminRoute.get("/admins/careers/applications", authMiddleware, getAdminCareerApplicationController);
adminRoute.get("/admins/careers/:careerId/applications/:applicationId", authMiddleware, getAdminCareerApplicationDetailController);
adminRoute.delete("/admins/careers/:careerId/applications/:applicationId", authMiddleware, deleteAdminCareerApplicationDetailController);
adminRoute.get("/admins/careers/:careerId", authMiddleware, getAdminCareerDetailController);
adminRoute.put("/admins/careers/:careerId", authMiddleware, editAdminCareerDetailController);
adminRoute.post("/admins/careers", authMiddleware, createAdminCareerController);
adminRoute.delete("/admins/careers/:careerId", authMiddleware, deleteAdminCareerDetailController);

/**
 * Products
 */

adminRoute.get("/admins/products", authMiddleware, getAdminProductController);
adminRoute.get("/admins/products/:productId", authMiddleware, getAdminProductDetailController);
adminRoute.put("/admins/products/:productId", authMiddleware, uploadProduct.array("photos", 3), editAdminProductDetailController);
adminRoute.post("/admins/products", authMiddleware, uploadProduct.array("photos", 3), createAdminProductController);
adminRoute.delete("/admins/products/:productId", authMiddleware, deleteAdminProductDetailController);

/**
 * Inquiries
 */

adminRoute.get("/admins/inquiries", authMiddleware, getAdminInquiryController);
adminRoute.get("/admins/inquiries/:inquiryId", authMiddleware, getAdminInquiryDetailController);
adminRoute.delete("/admins/inquiries/:inquiryId", authMiddleware, deleteAdminInquiryDetailController);

export { adminRoute };
