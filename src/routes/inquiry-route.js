import express from "express";

import { createInquiryController } from "../controllers/inquiry-controller.js";

const inquiryRoute = express.Router();

inquiryRoute.post("/inquiries", createInquiryController);
/**
 * Create for next commit
 */
// inquiryRoute.get("/inquiries/:inquiryId/thank-you", );

export { inquiryRoute };