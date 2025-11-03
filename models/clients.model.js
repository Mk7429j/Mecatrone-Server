import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Company subdocument schema
const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);

// Main Client schema
const clientSchema = new Schema(
  {
    client_name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    companies: {
      type: [CompanySchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one company is required",
      },
    },
    client_emails: [
      {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      },
    ],
    client_phones: [
      {
        type: String,
        trim: true,
        match: [/^[0-9]{7,15}$/, "Please enter a valid phone number"],
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "clients",
    timestamps: true,
  }
);

// ✅ Indexes
clientSchema.index({ client_name: 1 });
clientSchema.index({ "companies.name": 1 });

// ✅ Named export (consistent with Admin, Blog, etc.)
export const ClientSchema = model("Client", clientSchema);
