import mongoose from "mongoose";

const { Schema, model } = mongoose;

const workSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Work title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    info: [
      {
        heading: {
          type: String,
          required: [true, "Info heading is required"],
          trim: true,
          maxlength: [100, "Heading cannot exceed 100 characters"],
        },
        details: {
          type: String,
          required: [true, "Info details are required"],
          trim: true,
          maxlength: [1000, "Details cannot exceed 1000 characters"],
        },
        img: {
          type: String,
          required: [true, "Info image is required"],
          trim: true,
        },
      },
    ],

    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },

    is_active: { type: Boolean, default: true },
  },
  { collection: "works", timestamps: true }
);

export const WorkSchema = model("Work", workSchema);
