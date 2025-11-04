import mongoose from "mongoose";
const { Schema, model } = mongoose;

const projectSchema = new Schema(
  {
    project_name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    project_image: {
      type: String,
      required: [true, "Project image is required"],
      trim: true,
    },
    short_description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [250, "Short description cannot exceed 250 characters"],
    },
    project_url: {
      type: String,
      required: [true, "Project URL is required"],
      trim: true,
      match: [
        /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})([\/\w.-]*)*\/?$/,
        "Please enter a valid URL",
      ],
    },

    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client reference is required"],
    },

    // ✅ Only one Work reference now
    work_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Work",
      required: [true, "Work reference is required"],
    },

    is_active: { type: Boolean, default: true },
  },
  { collection: "projects", timestamps: true }
);

// 📈 Index for faster search
projectSchema.index({ project_name: 1, is_active: 1 });

export const ProjectSchema = model("Project", projectSchema);
