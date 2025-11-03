import express from "express";
import {
    addSubscriber,
    getAllSubscribers,
    deleteSubscribers,
} from "../controllers/newsletter.controller.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const news_router = express.Router();

// Public
news_router.post("/add", addSubscriber);

// Admin routes
news_router.get("/get", VerifyToken, getAllSubscribers);
news_router.delete("/delete", VerifyToken, deleteSubscribers);

export default news_router;
