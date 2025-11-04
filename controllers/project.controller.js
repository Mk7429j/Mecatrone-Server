import { ProjectSchema, ClientSchema, WorkSchema } from "../models/models_import.js";
import {
  successResponse,
  errorResponse,
} from "../helpers/response.helper.js";

import {
  ALL_FIELDS_REQUIRED,
  INVALID_CLIENT_REFERENCE,
  PAGES_NOT_FOUND,
  PROJECT_ADD_FAILED,
  PROJECT_ADD_SUCCESS,
  PROJECT_DELETE_FAILED,
  PROJECT_DELETE_SUCCESS,
  PROJECT_EDIT_FAILED,
  PROJECT_EDIT_SUCCESS,
  PROJECT_GET_BY_ID_FAILED,
  PROJECT_GET_BY_ID_SUCCESS,
  PROJECT_GET_FAILED,
  PROJECT_GET_SUCCESS,
} from "../helpers/message.helper.js";

// ===================================================
// 🟢 ADD PROJECT
// ===================================================
export const addProject = async (req, res) => {
  try {
    const {
      project_name,
      project_image,
      short_description,
      project_url,
      client_id,
      work_id,
    } = req.body;

    // ✅ Validate required fields
    if (
      !project_name ||
      !project_image ||
      !short_description ||
      !project_url ||
      !client_id ||
      !work_id
    ) {
      return errorResponse(res, ALL_FIELDS_REQUIRED);
    }

    // ✅ Check if client exists
    const client = await ClientSchema.findById(client_id);
    if (!client) return errorResponse(res, INVALID_CLIENT_REFERENCE);

    // ✅ Check if work exists
    const work = await WorkSchema.findById(work_id);
    if (!work) return errorResponse(res, "Invalid Work Reference");

    // ✅ Create new project
    const newProject = new ProjectSchema({
      project_name,
      project_image,
      short_description,
      project_url,
      client_id,
      work_id,
    });

    await newProject.save();

    return successResponse(res, PROJECT_ADD_SUCCESS, newProject);
  } catch (error) {
    console.error("❌ Error adding project:", error);
    return errorResponse(res, PROJECT_ADD_FAILED, error);
  }
};

// ===================================================
// 🟡 GET ALL PROJECTS
// ===================================================
export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectSchema.find()
      .populate("client_id", "client_name company_name client_email client_type")
      .populate("work_id", "work_name category")
      .sort({ createdAt: -1 });

    return successResponse(res, PROJECT_GET_SUCCESS, projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return errorResponse(res, PROJECT_GET_FAILED, error);
  }
};

// ===================================================
// 🔵 GET PROJECT BY ID
// ===================================================
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectSchema.findById(id)
      .populate("client_id", "client_name company_name client_email client_type")
      .populate("work_id", "work_name category");

    if (!project) return errorResponse(res, PAGES_NOT_FOUND);

    return successResponse(res, PROJECT_GET_BY_ID_SUCCESS, project);
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    return errorResponse(res, PROJECT_GET_BY_ID_FAILED, error);
  }
};

// ===================================================
// 🟠 EDIT PROJECT
// ===================================================
export const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_id, work_id, ...updateData } = req.body;

    // Validate client and work if provided
    if (client_id) {
      const client = await ClientSchema.findById(client_id);
      if (!client) return errorResponse(res, INVALID_CLIENT_REFERENCE);
      updateData.client_id = client_id;
    }

    if (work_id) {
      const work = await WorkSchema.findById(work_id);
      if (!work) return errorResponse(res, "Invalid Work Reference");
      updateData.work_id = work_id;
    }

    const updatedProject = await ProjectSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("client_id", "client_name company_name client_email client_type")
      .populate("work_id", "work_name category");

    if (!updatedProject) return errorResponse(res, PAGES_NOT_FOUND);

    return successResponse(res, PROJECT_EDIT_SUCCESS, updatedProject);
  } catch (error) {
    console.error("❌ Error updating project:", error);
    return errorResponse(res, PROJECT_EDIT_FAILED, error);
  }
};

// ===================================================
// 🔴 DELETE PROJECT
// ===================================================
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await ProjectSchema.findByIdAndDelete(id);
    if (!deletedProject) return errorResponse(res, PAGES_NOT_FOUND);

    return successResponse(res, PROJECT_DELETE_SUCCESS, deletedProject);
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    return errorResponse(res, PROJECT_DELETE_FAILED, error);
  }
};
