import express from "express";
import {
  addBlog,
  getBlogs,
  editBlog,
  deleteBlog,
} from "./controllers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const blogs_router = express.Router();

blogs_router.post("/add", VerifyToken, addBlog);
blogs_router.get("/all", VerifyToken, getBlogs);
blogs_router.put("/edit/:id", VerifyToken, editBlog);
blogs_router.delete("/delete/:id", VerifyToken, deleteBlog);

export default blogs_router;
