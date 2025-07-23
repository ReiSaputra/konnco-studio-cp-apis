import app from "./src/app.js";

import express from "express";
import path from "path";

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000");
});

export default app;