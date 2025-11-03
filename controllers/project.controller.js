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
      works,
    } = req.body;

    // Validate required fields
    if (
      !project_name ||
      !project_image ||
      !short_description ||
      !project_url ||
      !client_id ||
      !works
    ) {
      return errorResponse(res, ALL_FIELDS_REQUIRED);
    }

    // ✅ Check if client exists
    const client = await ClientSchema.findById(client_id);
    if (!client) return errorResponse(res, INVALID_CLIENT_REFERENCE);

    // ✅ Ensure works are stored in their collection
    const workDocs = [];
    for (const work of works) {
      const newWork = await WorkSchema.create(work);
      workDocs.push(newWork._id);
    }

    // ✅ Create new project
    const newProject = new ProjectSchema({
      project_name,
      project_image,
      short_description,
      project_url,
      client_id,
      client_name: client.client_name,
      client_email: client.client_email,
      company_name: client.company_name,
      works: workDocs, // store work IDs here
    });

    await newProject.save();

    return successResponse(res, PROJECT_ADD_SUCCESS, newProject);
  } catch (error) {
    console.error("❌ Error adding project:", error);
    return errorResponse(res, PROJECT_ADD_FAILED, error);
  }
};

// ===================================================
// 🟢 GET ALL PROJECTS
// ===================================================
export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectSchema.find()
      .populate("client_id", "client_name company_name client_email client_type")
      .populate("works")
      .sort({ createdAt: -1 });

    return successResponse(res, PROJECT_GET_SUCCESS, projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    return errorResponse(res, PROJECT_GET_FAILED, error);
  }
};

// ===================================================
// 🟢 GET PROJECT BY ID
// ===================================================
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectSchema.findById(id)
      .populate("client_id", "client_name company_name client_email client_type")
      .populate("works");

    if (!project) return errorResponse(res, PAGES_NOT_FOUND);

    return successResponse(res, PROJECT_GET_BY_ID_SUCCESS, project);
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    return errorResponse(res, PROJECT_GET_BY_ID_FAILED, error);
  }
};

// ===================================================
// 🟢 EDIT PROJECT
// ===================================================
export const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // ✅ Update client info if client_id changed
    if (updateData.client_id) {
      const client = await ClientSchema.findById(updateData.client_id);
      if (!client) return errorResponse(res, INVALID_CLIENT_REFERENCE);

      updateData.client_name = client.client_name;
      updateData.client_email = client.client_email;
      updateData.company_name = client.company_name;
    }

    // ✅ If new works provided, save them separately
    if (updateData.works && updateData.works.length > 0) {
      const workDocs = [];
      for (const work of updateData.works) {
        const newWork = await WorkSchema.create(work);
        workDocs.push(newWork._id);
      }
      updateData.works = workDocs;
    }

    const updatedProject = await ProjectSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("client_id works");

    if (!updatedProject) return errorResponse(res, PAGES_NOT_FOUND);

    return successResponse(res, PROJECT_EDIT_SUCCESS, updatedProject);
  } catch (error) {
    console.error("❌ Error updating project:", error);
    return errorResponse(res, PROJECT_EDIT_FAILED, error);
  }
};

// ===================================================
// 🟢 DELETE PROJECT
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
