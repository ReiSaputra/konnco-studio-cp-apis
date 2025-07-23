import express from "express";
import { loginAdminController } from "../controllers/admin-controller.js";

const adminRoute = express.Router();

adminRoute.post("/auth/admins/login", loginAdminController);

export { adminRoute };
