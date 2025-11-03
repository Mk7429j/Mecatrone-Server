import { BannerSchema } from "../models/models_import.js";
import {
    successResponse,
    errorResponse,
} from "../helpers/response.helper.js";
import {
    ALL_FIELDS_REQUIRED,
    BANNER_ADD_FAILED,
    BANNER_ADD_SUCCESS,
    BANNER_DELETE_FAILED,
    BANNER_DELETE_SUCCESS,
    BANNER_EDIT_FAILED,
    BANNER_EDIT_SUCCESS,
    BANNER_GET_BY_ID_FAILED,
    BANNER_GET_BY_ID_SUCCESS,
    BANNER_GET_FAILED,
    BANNER_GET_SUCCESS,
    BANNER_NOT_FOUND,
    POSITION_EXISTS,
} from "../helpers/message.helper.js";

// ===================================================
// 🟢 ADD BANNER
// ===================================================
export const addBanner = async (req, res) => {
    try {
        const { name, description, img, position, time, is_active } = req.body;

        if (!name || !description || !img || !position) {
            return errorResponse(res, ALL_FIELDS_REQUIRED);
        }

        // Check for unique position
        const existingPosition = await BannerSchema.findOne({ position });
        if (existingPosition) return errorResponse(res, POSITION_EXISTS);

        const newBanner = new BannerSchema({
            name,
            description,
            img,
            position,
            time,
            is_active,
        });

        await newBanner.save();

        return successResponse(res, BANNER_ADD_SUCCESS, newBanner);
    } catch (error) {
        console.error("Error adding banner:", error);
        return errorResponse(res, BANNER_ADD_FAILED, error);
    }
};

// ===================================================
// 🟢 GET ALL BANNERS
// ===================================================
export const getAllBanners = async (req, res) => {
    try {
        const banners = await BannerSchema.find().sort({ position: 1 });
        return successResponse(res, BANNER_GET_SUCCESS, banners);
    } catch (error) {
        console.error("Error fetching banners:", error);
        return errorResponse(res, BANNER_GET_FAILED, error);
    }
};

// ===================================================
// 🟢 GET BANNER BY ID
// ===================================================
export const getBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await BannerSchema.findById(id);

        if (!banner) return errorResponse(res, BANNER_NOT_FOUND);
        return successResponse(res, BANNER_GET_BY_ID_SUCCESS, banner);
    } catch (error) {
        console.error("Error fetching banner:", error);
        return errorResponse(res, BANNER_GET_BY_ID_FAILED, error);
    }
};

// ===================================================
// 🟢 EDIT BANNER
// ===================================================
export const editBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If updating position, ensure it’s unique
        if (updateData.position) {
            const positionExists = await BannerSchema.findOne({
                position: updateData.position,
                _id: { $ne: id },
            });
            if (positionExists) return errorResponse(res, POSITION_EXISTS);
        }

        const updatedBanner = await BannerSchema.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedBanner) return errorResponse(res, BANNER_NOT_FOUND);
        return successResponse(res, BANNER_EDIT_SUCCESS, updatedBanner);
    } catch (error) {
        console.error("Error updating banner:", error);
        return errorResponse(res, BANNER_EDIT_FAILED, error);
    }
};

// ===================================================
// 🟢 DELETE BANNER
// ===================================================
export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBanner = await BannerSchema.findByIdAndDelete(id);
        if (!deletedBanner) return errorResponse(res, BANNER_NOT_FOUND);

        return successResponse(res, BANNER_DELETE_SUCCESS, deletedBanner);
    } catch (error) {
        console.error("Error deleting banner:", error);
        return errorResponse(res, BANNER_DELETE_FAILED, error);
    }
};
