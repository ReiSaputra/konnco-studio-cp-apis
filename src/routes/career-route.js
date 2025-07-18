import express from "express";
import multer from "multer";
import fs from "fs";

import { createCareerApplicationController } from "../controllers/career-controller.js";

import { FileUploadError } from "../helpers/class/file-upload-error.js";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const careerRoute = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new FileUploadError("Only PDF files are allowed", 400), false);
    }
    if (file.size > 2 * 1024 * 1024) {
      return cb(new FileUploadError("File size must be less than 2MB", 400), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

// careerRoute.get("/sda", upload.single("file"), (req, res, next) => {
//   const files = req.file.filename
// });
careerRoute.post("/careers/:careerId/applications", upload.single("cv"), createCareerApplicationController);

export { careerRoute };
