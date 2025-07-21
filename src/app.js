import express from "express";
import cors from "cors";
import { blogRoute } from "./routes/blog-route.js";
import { inquiryRoute } from "./routes/inquiry-route.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
}));

app.use(express.json());

// Routes
app.use("/api/v1", blogRoute);
app.use("/api/v1", inquiryRoute);

// Global error handler
app.use(errorMiddleware);

app.use("/uploads", express.static("public/uploads"));

export default app;
