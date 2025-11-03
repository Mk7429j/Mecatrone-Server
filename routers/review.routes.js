import express from "express";
import {
    addReview,
    getAllReviews,
    editReview,
    deleteReview
} from "./controllers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const review_router = express.Router();

review_router.post("/add", addReview);
review_router.get("/all", getAllReviews);
review_router.put("/edit/:id", VerifyToken, editReview);
review_router.delete("/delete/:id", VerifyToken, deleteReview);

export default review_router;
