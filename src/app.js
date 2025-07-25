import "dotenv/config";
import express from "express";
import cors from "cors";
import cors from "cors";

import { errorMiddleware } from "./middlewares/error-middleware.js";

import { blogRoute } from "./routes/blog-route.js";
import { inquiryRoute } from "./routes/inquiry-route.js";
import { careerRoute } from "./routes/career-route.js";
import { adminRoute } from "./routes/admin-route.js";
import { productRoute } from "./routes/product-route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/v1", adminRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", inquiryRoute);
app.use("/api/v1", careerRoute);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Resource not found",
  });
});

app.use(errorMiddleware);

export default app;
