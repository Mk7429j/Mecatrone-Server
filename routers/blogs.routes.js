import express from "express";
import {
  addBlog,
  getBlogs,
  editBlog,
  deleteBlog,
} from "./controllers_import.js";

const blogs_router = express.Router();

blogs_router.post("/add", addBlog);
blogs_router.get("/all", getBlogs);
blogs_router.put("/edit/:id", editBlog);
blogs_router.delete("/delete/:id", deleteBlog);

export default blogs_router;
