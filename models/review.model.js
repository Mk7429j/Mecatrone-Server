import mongoose from "mongoose";
import { ClientSchema } from "./models_import.js";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    user_name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    user_email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    company_name: {
      type: String,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "reviews",
    timestamps: true,
  }
);

// 🧠 Automatically verify review if client exists
reviewSchema.pre("save", async function (next) {
  const { user_email, company_name } = this;

  try {
    const existingClient = await ClientSchema.findOne({
      $or: [
        { client_emails: user_email },
        { "companies.name": company_name },
      ],
    });

    this.is_verified = !!existingClient;
  } catch (error) {
    console.error("Error verifying client in ReviewSchema:", error);
  }

  next();
});

// ✅ Correct export — use lowercase schema name here
export const ReviewSchema = model("Review", reviewSchema);
