import express from "express";
import { blogRoute } from "./routes/blog-route.js";
import { inquiryRoute } from "./routes/inquiry-route.js";

const app = express();

app.use(express.json());
app.use("/api/v1", blogRoute);
app.use("/api/v1", inquiryRoute);

export default app;
