import mongoose from "mongoose";
import { ClientSchema } from "./models_import.js"; 

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

    // 🧩 Link to client
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client reference is required"],
    },

    // 🧾 Denormalized client info (auto-filled)
    client_name: { type: String, trim: true },
    client_email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
    },
    company_name: { type: String, trim: true },

    // 🔗 Linked works (separate collection)
    works: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work",
      },
    ],

    is_active: { type: Boolean, default: true },
  },
  { collection: "projects", timestamps: true }
);

// 🧠 Auto-populate client details when saving
projectSchema.pre("save", async function (next) {
  try {
    if (this.client_id) {
      const client = await ClientSchema.findById(this.client_id);
      if (client) {
        this.client_name = client.client_name || "";
        this.client_email = client.client_email || "";
        this.company_name = client.company_name || "";
      }
    }
  } catch (error) {
    console.error("Error populating client details in ProjectSchema:", error);
  }
  next();
});

// 📈 Index for faster search
projectSchema.index({ project_name: 1, is_active: 1 });

export const ProjectSchema = model("Project", projectSchema);
