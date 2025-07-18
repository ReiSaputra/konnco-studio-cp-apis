import express from "express";

import { createInquiryController, getResponseInquiryController } from "../controllers/inquiry-controller.js";

const inquiryRoute = express.Router();

inquiryRoute.post("/inquiries", createInquiryController);
inquiryRoute.get("/inquiries/:inquiryId/thank-you", getResponseInquiryController);

export { inquiryRoute };