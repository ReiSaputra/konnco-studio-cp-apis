import express from "express";
import { loginAdminController, dashboardAdminController } from "../controllers/admin-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const adminRoute = express.Router();

// Auth
adminRoute.post("/auth/admins/login", loginAdminController);

// Dashboard
adminRoute.get("/admins/dashboard/overview", authMiddleware, dashboardAdminController);

// Blogs

// Careers

// Products

// Inquiries

export { adminRoute };
