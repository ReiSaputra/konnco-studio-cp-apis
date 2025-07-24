import express from "express";
import { loginAdminController, dashboardAdminController, getAdminBlogsController, getAdminBlogDetailController } from "../controllers/admin-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const adminRoute = express.Router();

// Auth
adminRoute.post("/admins/auth/login", loginAdminController);

// Dashboard
adminRoute.get("/admins/dashboard/overview", authMiddleware, dashboardAdminController);

// Blogs
adminRoute.get("/admins/blogs", authMiddleware, getAdminBlogsController);
adminRoute.get("/admins/blogs/:blogSlug", authMiddleware, getAdminBlogDetailController);

// Careers


// Products

// Inquiries

export { adminRoute };
