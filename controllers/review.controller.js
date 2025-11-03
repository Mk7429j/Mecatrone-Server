// controllers/review.controller.js

import { ReviewSchema } from "../models/models_import.js";
import {
    successResponse,
    errorResponse,
} from "../helpers/response.helper.js";

import {
    ADD_REVIEW_SUCCESS,
    REVIEW_ADD_FAILED,
    REVIEW_FETCH_SUCCESS,
    REVIEW_FETCH_FAILED,
    REVIEW_EDIT_SUCCESS,
    REVIEW_EDIT_FAILED,
    REVIEW_DELETE_SUCCESS,
    REVIEW_DELETE_FAILED,
    REVIEW_NOT_FOUND,
} from "../helpers/message.helper.js";

// ===================================================
// 🟢 ADD REVIEW
// ===================================================
export const addReview = async (req, res) => {
    try {
        const review = await ReviewSchema.create(req.body);
        return successResponse(res, ADD_REVIEW_SUCCESS, review);
    } catch (err) {
        console.error("Add Review Error:", err);
        return errorResponse(res, REVIEW_ADD_FAILED, err);
    }
};

// ===================================================
// 🟡 GET ALL REVIEWS
// ===================================================
// Optional filter: ?verified=true / ?verified=false
export const getAllReviews = async (req, res) => {
    try {
        const { verified } = req.query;

        let filter = {};
        if (verified === "true") filter.is_verified = true;
        else if (verified === "false") filter.is_verified = false;

        const reviews = await ReviewSchema.find(filter).sort({ createdAt: -1 });

        return successResponse(res, REVIEW_FETCH_SUCCESS, reviews);
    } catch (err) {
        console.error("Get Reviews Error:", err);
        return errorResponse(res, REVIEW_FETCH_FAILED, err);
    }
};

// ===================================================
// 🟠 EDIT REVIEW
// ===================================================
export const editReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReview = await ReviewSchema.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedReview) {
            return errorResponse(res, REVIEW_NOT_FOUND);
        }

        return successResponse(res, REVIEW_EDIT_SUCCESS, updatedReview);
    } catch (err) {
        console.error("Edit Review Error:", err);
        return errorResponse(res, REVIEW_EDIT_FAILED, err);
    }
};

// ===================================================
// 🔴 DELETE REVIEW
// ===================================================
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await ReviewSchema.findByIdAndDelete(id);

        if (!deletedReview) {
            return errorResponse(res, REVIEW_NOT_FOUND);
        }

        return successResponse(res, REVIEW_DELETE_SUCCESS);
    } catch (err) {
        console.error("Delete Review Error:", err);
        return errorResponse(res, REVIEW_DELETE_FAILED, err);
    }
};
