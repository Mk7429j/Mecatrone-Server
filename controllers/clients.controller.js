import { successResponse, errorResponse } from "../helpers/response.helper.js";
import {
  ADD_CLIENT_SUCCESS,
  CLIENT_ADD_FAILED,
  CLIENT_FETCH_SUCCESS,
  CLIENT_FETCH_FAILED,
  CLIENT_NOT_FOUND,
  CLIENT_EDIT_SUCCESS,
  CLIENT_EDIT_FAILED,
  CLIENT_DELETE_SUCCESS,
  CLIENT_DELETE_FAILED,
} from "../helpers/message.helper.js";

import { ClientSchema } from "../models/models_import.js";

// ===================================================
// 🟢 ADD CLIENT
// ===================================================
export const addClient = async (req, res) => {
  try {
    const client = await ClientSchema.create(req.body);
    return successResponse(res, ADD_CLIENT_SUCCESS, client);
  } catch (err) {
    console.error("Add Client Error:", err);
    return errorResponse(res, CLIENT_ADD_FAILED, err);
  }
};

// ===================================================
// 🟡 GET ALL CLIENTS
// ===================================================
export const getAllClients = async (req, res) => {
  try {
    const clients = await ClientSchema.find().sort({ createdAt: -1 });
    return successResponse(res, CLIENT_FETCH_SUCCESS, clients);
  } catch (err) {
    console.error("Get Clients Error:", err);
    return errorResponse(res, CLIENT_FETCH_FAILED, err);
  }
};

// ===================================================
// 🟠 GET SINGLE CLIENT BY ID
// ===================================================
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await ClientSchema.findById(id);

    if (!client) {
      return errorResponse(res, CLIENT_NOT_FOUND);
    }

    return successResponse(res, CLIENT_FETCH_SUCCESS, client);
  } catch (err) {
    console.error("Get Single Client Error:", err);
    return errorResponse(res, CLIENT_FETCH_FAILED, err);
  }
};

// ===================================================
// 🔵 EDIT CLIENT
// ===================================================
export const editClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClient = await ClientSchema.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedClient) {
      return errorResponse(res, CLIENT_NOT_FOUND);
    }

    return successResponse(res, CLIENT_EDIT_SUCCESS, updatedClient);
  } catch (err) {
    console.error("Edit Client Error:", err);
    return errorResponse(res, CLIENT_EDIT_FAILED, err);
  }
};

// ===================================================
// 🔴 DELETE CLIENT
// ===================================================
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClient = await ClientSchema.findByIdAndDelete(id);

    if (!deletedClient) {
      return errorResponse(res, CLIENT_NOT_FOUND);
    }

    return successResponse(res, CLIENT_DELETE_SUCCESS);
  } catch (err) {
    console.error("Delete Client Error:", err);
    return errorResponse(res, CLIENT_DELETE_FAILED, err);
  }
};
