// controllers/admin.controller.js
import { AdminSchema } from "../models/admin.model.js";
import { hashPassword } from "../helpers/shared.helper.js";
import {
  errorResponse,
  successResponse,
} from "../helpers/response.helper.js";
import {
  ADMIN_ADDED_SUCCESS,
  ADMIN_ADDED_FAILED,
  ADMIN_GETTED_SUCCESS,
  ADMIN_GETTED_FAILED,
  ADMIN_UPDATED_SUCCESS,
  ADMIN_UPDATED_FAILED,
  ADMIN_DELETED_SUCCESS,
  ADMIN_DELETED_FAILED,
  ADMIN_ACCOUNT_ALREADY_EXISTS,
} from "../helpers/message.helper.js";

/* ======================================================
   🔹 ADD NEW ADMIN
   ====================================================== */
export const addAdmin = async (req, res) => {
  try {
    const { email, password, name, role, phone } = req.body;

    // ✅ Validate required fields
    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      return errorResponse(res, "Email, name, and password are required.", 400);
    }

    // ✅ Check for existing account
    const existingAdmin = await AdminSchema.findOne({ email });
    if (existingAdmin) {
      return errorResponse(res, ADMIN_ACCOUNT_ALREADY_EXISTS, 409);
    }

    // ✅ Encrypt password
    const hashedPassword = await hashPassword(password);

    // ✅ Create and save new admin
    const newAdmin = new AdminSchema({
      email,
      password: hashedPassword,
      name: name.trim(),
      role: role || "admin",
      phone: phone || null,
    });

    const savedAdmin = await newAdmin.save();

    // ✅ Remove password before sending response
    const result = savedAdmin.toObject();
    delete result.password;

    return successResponse(res, ADMIN_ADDED_SUCCESS, result);
  } catch (error) {
    console.error("🚨 addAdmin Error:", error);
    return errorResponse(res, ADMIN_ADDED_FAILED, 500);
  }
};

/* ======================================================
   🔹 GET ADMIN BY ID
   ====================================================== */
export const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return errorResponse(res, "Admin ID is required.", 400);

    const admin = await AdminSchema.findById(id).select("-password");

    if (!admin) return errorResponse(res, "Admin not found.", 404);

    return successResponse(res, ADMIN_GETTED_SUCCESS, admin);
  } catch (error) {
    console.error("🚨 getAdmin Error:", error);
    return errorResponse(res, ADMIN_GETTED_FAILED, 500);
  }
};

/* ======================================================
   🔹 UPDATE ADMIN DETAILS
   ====================================================== */
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (!id) return errorResponse(res, "Admin ID is required.", 400);

    // ✅ Securely hash password if updating it
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    const updatedAdmin = await AdminSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedAdmin) {
      return errorResponse(res, "Admin not found.", 404);
    }

    return successResponse(res, ADMIN_UPDATED_SUCCESS, updatedAdmin);
  } catch (error) {
    console.error("🚨 updateAdmin Error:", error);
    return errorResponse(res, ADMIN_UPDATED_FAILED, 500);
  }
};

/* ======================================================
   🔹 DELETE ADMIN
   ====================================================== */
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return errorResponse(res, "Admin ID is required.", 400);

    const deletedAdmin = await AdminSchema.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return errorResponse(res, "Admin not found.", 404);
    }

    return successResponse(res, ADMIN_DELETED_SUCCESS);
  } catch (error) {
    console.error("🚨 deleteAdmin Error:", error);
    return errorResponse(res, ADMIN_DELETED_FAILED, 500);
  }
};
