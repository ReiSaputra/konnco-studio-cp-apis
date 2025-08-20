import express from "express";
import { createAdminController, deleteAdminController, getAdminController, getAdminDetailController, updateAdminController } from "../controllers/super-admin-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const superAdminRoute = express.Router();

superAdminRoute.get("/super-admins/admins", authMiddleware, getAdminController);
superAdminRoute.get("/super-admins/admins/:adminId", authMiddleware, getAdminDetailController);
superAdminRoute.post("/super-admins/admins", authMiddleware, createAdminController);
superAdminRoute.put("/super-admins/admins/:adminId", authMiddleware, updateAdminController);
superAdminRoute.delete("/super-admins/admins/:adminId", authMiddleware, deleteAdminController);
// superAdminRoute.patch("/super-admins/admins/:adminId/blogs/permisssions", authMiddleware, updateAdminPermissionBlogController);
// superAdminRoute.patch("/super-admins/admins/:adminId/products/permisssions", authMiddleware, updateAdminPermissionProductController);
// superAdminRoute.get("/super-admins/admins/:adminId", authMiddleware, getAdminDetailController);
// superAdminRoute.get("/super-admins/admins/:adminId", authMiddleware, getAdminDetailController);

export { superAdminRoute };
