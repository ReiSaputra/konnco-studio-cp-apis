import express from "express";
import { blogRoute } from "./routes/blog-route";

const app = express();

app.use(express.json());
app.use("/api/v1", blogRoute);

export default app;
