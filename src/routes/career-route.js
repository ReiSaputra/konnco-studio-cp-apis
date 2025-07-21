import express from "express";
import multer from "multer";
import fs from "fs";

import { createCareerApplicationController } from "../controllers/career-controller.js";

import { FileUploadError } from "../helpers/class/file-upload-error.js";

if (!fs.existsSync("assets/files/cv")) {
  fs.mkdirSync("assets/files/cv", { recursive: true });
}

const careerRoute = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/files/cv/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// careerRoute.get("/sda", upload.single("file"), (req, res, next) => {
//   const files = req.file.filename
// });

careerRoute.post("/careers/:careerId/applications", upload.single("cv"), createCareerApplicationController);

export { careerRoute };
