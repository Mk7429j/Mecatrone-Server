import mongoose from "mongoose";

const { Schema, model } = mongoose;

const enquirySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        company_name: {
            type: String,
            trim: true,
            default: "",
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            maxlength: [1000, "Message cannot exceed 1000 characters"],
        },

        is_opened: {
            type: Boolean,
            default: false,
        },

        opened_at: {
            type: Date,
            default: null,
        },
    },
    {
        collection: "enquiries",
        timestamps: true,
    }
);

export const EnquirySchema = model("Enquiry", enquirySchema);
