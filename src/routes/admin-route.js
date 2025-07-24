import express from "express";
import { loginAdminController, dashboardAdminController } from "../controllers/admin-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const adminRoute = express.Router();

// Auth
// adminRoute.post("/admins/auth/login", loginAdminController);
adminRoute.post("/auth/admins/login", loginAdminController);

// Dashboard
adminRoute.get("/admins/dashboard/overview", authMiddleware, dashboardAdminController);

// Blogs
adminRoute.get("/admins/blogs", authMiddleware, dashboardAdminController);

// Careers

// Products

// Inquiries

export { adminRoute };

