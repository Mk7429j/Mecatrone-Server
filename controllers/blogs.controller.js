// controllers/blog.controller.js

import {
  ADD_BLOG_SUCCESS,
  BLOG_ADD_FAILED,
  BLOG_GET_SUCCESS,
  BLOG_GET_FAILED,
  BLOG_EDITED_SUCCESS,
  BLOG_EDITED_FAILED,
  BLOG_DELETED_SUCESS,
  BLOG_DELETED_FAILED,
} from "../helpers/message.helper.js";

import { successResponse, errorResponse } from "../helpers/response.helper.js";
import { BlogSchema } from "../models/models_import.js";

// ===================================================
// 🟢 ADD BLOG
// ===================================================
export const addBlog = async (req, res) => {
  try {
    const blog = await BlogSchema.create(req.body);
    return successResponse(res, ADD_BLOG_SUCCESS, blog);
  } catch (err) {
    console.error("❌ Add Blog Error:", err);
    return errorResponse(res, BLOG_ADD_FAILED, err);
  }
};

// ===================================================
// 🟡 GET ALL BLOGS
// ===================================================
export const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogSchema.find().sort({ createdAt: -1 });
    return successResponse(res, BLOG_GET_SUCCESS, blogs);
  } catch (err) {
    console.error("❌ Get Blogs Error:", err);
    return errorResponse(res, BLOG_GET_FAILED, err);
  }
};

// ===================================================
// 🟠 EDIT BLOG
// ===================================================
export const editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlog = await BlogSchema.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) return errorResponse(res, "Blog not found", null, 404);

    return successResponse(res, BLOG_EDITED_SUCCESS, updatedBlog);
  } catch (err) {
    console.error("❌ Edit Blog Error:", err);
    return errorResponse(res, BLOG_EDITED_FAILED, err);
  }
};

// ===================================================
// 🔴 DELETE BLOG
// ===================================================
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BlogSchema.findByIdAndDelete(id);

    if (!deleted) return errorResponse(res, "Blog not found", null, 404);

    return successResponse(res, BLOG_DELETED_SUCESS);
  } catch (err) {
    console.error("❌ Delete Blog Error:", err);
    return errorResponse(res, BLOG_DELETED_FAILED, err);
  }
};
