import express from "express";

const careerRoute = express.Router();

careerRoute.get("/careers");

export { careerRoute };
