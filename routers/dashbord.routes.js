import express from "express";
import { getDashboardStats } from "./controllers_import.js";

const dash_router = express.Router();

dash_router.get("/all", getDashboardStats);

export default dash_router;
