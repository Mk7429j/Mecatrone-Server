import { WorkSchema, ProjectSchema } from "../models/models_import.js";
import { successResponse, errorResponse } from "../helpers/response.helper.js";
import {
    ALL_FIELDS_REQUIRED,
    WORK_ADD_FAILED,
    WORK_ADD_SUCCESS,
    WORK_GET_FAILED,
    WORK_GET_SUCCESS,
    WORK_GET_BY_ID_SUCCESS,
    WORK_GET_BY_ID_FAILED,
    WORK_EDIT_SUCCESS,
    WORK_EDIT_FAILED,
    WORK_DELETE_SUCCESS,
    WORK_DELETE_FAILED,
    PAGES_NOT_FOUND,
    INVALID_PROJECT_REFERENCE,
} from "../helpers/message.helper.js";

// ===================================================
// 🟢 ADD WORK
// ===================================================
export const addWork = async (req, res) => {
    try {
        const { title, info, project_id } = req.body;

        if (!title || !info || info.length === 0) {
            return errorResponse(res, ALL_FIELDS_REQUIRED);
        }

        // ✅ Optional project link check
        if (project_id) {
            const project = await ProjectSchema.findById(project_id);
            if (!project) return errorResponse(res, INVALID_PROJECT_REFERENCE);
        }

        const newWork = new WorkSchema({
            title,
            info,
            project_id,
        });

        await newWork.save();

        return successResponse(res, WORK_ADD_SUCCESS, newWork);
    } catch (error) {
        console.error("❌ Error adding work:", error);
        return errorResponse(res, WORK_ADD_FAILED, error);
    }
};

// ===================================================
// 🟢 GET ALL WORKS
// ===================================================
export const getAllWorks = async (req, res) => {
    try {
        const works = await WorkSchema.find()
            .populate("project_id", "project_name short_description")
            .sort({ createdAt: -1 });

        return successResponse(res, WORK_GET_SUCCESS, works);
    } catch (error) {
        console.error("❌ Error fetching works:", error);
        return errorResponse(res, WORK_GET_FAILED, error);
    }
};

// ===================================================
// 🟢 GET WORK BY ID
// ===================================================
export const getWorkById = async (req, res) => {
    try {
        const { id } = req.params;

        const work = await WorkSchema.findById(id).populate(
            "project_id",
            "project_name short_description"
        );

        if (!work) return errorResponse(res, PAGES_NOT_FOUND);

        return successResponse(res, WORK_GET_BY_ID_SUCCESS, work);
    } catch (error) {
        console.error("❌ Error fetching work:", error);
        return errorResponse(res, WORK_GET_BY_ID_FAILED, error);
    }
};

// ===================================================
// 🟢 EDIT WORK
// ===================================================
export const editWork = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Optional project validation
        if (updateData.project_id) {
            const project = await ProjectSchema.findById(updateData.project_id);
            if (!project) return errorResponse(res, INVALID_PROJECT_REFERENCE);
        }

        const updatedWork = await WorkSchema.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedWork) return errorResponse(res, PAGES_NOT_FOUND);

        return successResponse(res, WORK_EDIT_SUCCESS, updatedWork);
    } catch (error) {
        console.error("❌ Error updating work:", error);
        return errorResponse(res, WORK_EDIT_FAILED, error);
    }
};

// ===================================================
// 🟢 DELETE WORK
// ===================================================
export const deleteWork = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedWork = await WorkSchema.findByIdAndDelete(id);
        if (!deletedWork) return errorResponse(res, PAGES_NOT_FOUND);

        return successResponse(res, WORK_DELETE_SUCCESS, deletedWork);
    } catch (error) {
        console.error("❌ Error deleting work:", error);
        return errorResponse(res, WORK_DELETE_FAILED, error);
    }
};
