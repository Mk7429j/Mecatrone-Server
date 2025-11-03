// models/blogs.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    blog_name: {
      type: String,
      required: [true, "Blog name is required"],
      trim: true,
    },
    blog_image: {
      type: String,
      required: [true, "Blog image is required"],
      trim: true,
    },
    short_description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 250,
    },
    blog_descriptions: [
      {
        heading: { type: String, trim: true },
        content: { type: String, trim: true },
        image: { type: String, trim: true },
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "blogs",
    timestamps: true,
  }
);

// ✅ Named export (consistent with admin.model.js)
export const BlogSchema = model("Blog", blogSchema);
