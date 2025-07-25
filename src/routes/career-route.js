import express from "express";
import multer from "multer";
import fs from "fs";
import { createMulterUpload } from "../middlewares/upload-middleware.js";

import { createCareerApplicationController, getCareerController, getCareerDetailController, getResponseApplicationController } from "../controllers/career-controller.js";

import { FileUploadError } from "../helpers/class/file-upload-error.js";

const path = "assets/files/cv";

if (!fs.existsSync(path)) {
  fs.mkdirSync(path, { recursive: true });
}

const careerRoute = express.Router();

const upload = createMulterUpload(path, 2);

careerRoute.get("/careers", getCareerController);
careerRoute.get("/careers/:careerId", getCareerDetailController);
careerRoute.post("/careers/:careerId/applications", upload.single("cv"), createCareerApplicationController);
careerRoute.get("/careers/:careerId/applications/:applicationId/thank-you", getResponseApplicationController);

export { careerRoute };
