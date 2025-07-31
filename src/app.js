import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { errorMiddleware } from "./middlewares/error-middleware.js";

import { blogRoute } from "./routes/blog-route.js";
import { inquiryRoute } from "./routes/inquiry-route.js";
import { careerRoute } from "./routes/career-route.js";
import { adminRoute } from "./routes/admin-route.js";
import { productRoute } from "./routes/product-route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use("/blogs", express.static(path.join(__dirname, "public", "blogs")));

// API routes
app.use("/api/v1", adminRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", inquiryRoute);
app.use("/api/v1", careerRoute);

// 404 fallback
app.use((req, res, next) => {
  res.status(404).json({
    message: "Resource not found",
  });
});

// Error handler middleware
app.use(errorMiddleware);

export default app;
