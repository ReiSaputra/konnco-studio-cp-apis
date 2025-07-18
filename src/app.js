import express from "express";

// import { blogRoute } from "./routes/blog-route.js";
import { inquiryRoute } from "./routes/inquiry-route.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import { careerRoute } from "./routes/career-route.js";

const app = express();

app.use(express.json());
// app.use("/api/v1", blogRoute);
app.use("/api/v1", inquiryRoute);
app.use("/api/v1", careerRoute);
app.use(errorMiddleware);

export default app;
