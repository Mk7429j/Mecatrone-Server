import {
    ENQUIRY_ADDED_SUCCESS,
    ENQUIRY_ADD_FAILED,
    ENQUIRY_GET_SUCCESS,
    ENQUIRY_GET_FAILED,
    ENQUIRY_EDITED_SUCCESS,
    ENQUIRY_EDITED_FAILED,
    ENQUIRY_DELETED_SUCCESS,
    ENQUIRY_DELETED_FAILED,
} from "../helpers/message.helper.js";

import { successResponse, errorResponse } from "../helpers/response.helper.js";
import { EnquirySchema } from "../models/models_import.js";
import { sendMail } from "../helpers/mail.helper.js";

// ===================================================
// 🟢 ADD ENQUIRY (Save + Send Mail)
// ===================================================

export const addEnquiry = async (req, res) => {
    try {
        const { name, email, phone, message, company } = req.body;

        // ✅ Validate input
        if (!email || !message) {
            return errorResponse(res, "Email and message are required", 400);
        }

        // ✅ Save enquiry to DB
        const newEnquiry = await EnquirySchema.create({
            name,
            email,
            phone,
            company,
            message,
            opened: false,
        });

        // ✅ Send email to admin (using EJS template)
        await sendMail({
            to: process.env.ADMIN_EMAIL || process.env.MAIL_USER,
            subject: `📩 New Enquiry from ${name || "User"}`,
            template: "enquiry", // your EJS file name (enquiry.ejs)
            data: { name, email, phone, company, message },
        });

        await sendMail({
            to: email,
            subject: "Thanks for contacting Mecatronix!",
            template: "enquiryUser", // optional user template (if you create it)
            data: { name, message },
        });

        // ✅ Success response
        return successResponse(res, ENQUIRY_ADDED_SUCCESS, newEnquiry);
    } catch (error) {
        console.error("🚨 Error adding enquiry:", error);
        return errorResponse(res, ENQUIRY_ADD_FAILED, error.message);
    }
};


// ===================================================
// 🟡 GET ALL ENQUIRIES
// ===================================================
export const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await EnquirySchema.find().sort({ createdAt: -1 });
        return successResponse(res, ENQUIRY_GET_SUCCESS, enquiries);
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        return errorResponse(res, ENQUIRY_GET_FAILED, error.message);
    }
};

// ===================================================
// 🟢 GET ENQUIRY BY ID — Auto mark as opened
// ===================================================
export const getEnquiryById = async (req, res) => {
    try {
        const { id } = req.params;

        const enquiry = await EnquirySchema.findById(id);
        if (!enquiry) {
            return errorResponse(res, PAGES_NOT_FOUND, "Enquiry not found.");
        }

        // ✅ Automatically mark as opened if not already
        if (!enquiry.is_opened) {
            enquiry.is_opened = true;
            enquiry.opened_at = new Date();
            await enquiry.save();
        }

        return successResponse(res, ENQUIRY_GET_SUCCESS, enquiry);
    } catch (error) {
        console.error("Error fetching enquiry:", error);
        return errorResponse(res, ENQUIRY_GET_FAILED, error.message);
    }
};

// ===================================================
// 🟣 EDIT ENQUIRY
// ===================================================
export const editEnquiry = async (req, res) => {
    try {
        const updated = await EnquirySchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return errorResponse(res, ENQUIRY_EDITED_FAILED, "Enquiry not found.");
        }

        return successResponse(res, ENQUIRY_EDITED_SUCCESS, updated);
    } catch (error) {
        console.error("Error updating enquiry:", error);
        return errorResponse(res, ENQUIRY_EDITED_FAILED, error.message);
    }
};

// ===================================================
// 🔴 DELETE ENQUIRY
// ===================================================
export const deleteEnquiry = async (req, res) => {
    try {
        const deleted = await EnquirySchema.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return errorResponse(res, ENQUIRY_DELETED_FAILED, "Enquiry not found.");
        }

        return successResponse(res, ENQUIRY_DELETED_SUCCESS, deleted);
    } catch (error) {
        console.error("Error deleting enquiry:", error);
        return errorResponse(res, ENQUIRY_DELETED_FAILED, error.message);
    }
};
