// routers/projects.routes.js
import express from "express";
import {
    addProject,
    getAllProjects,
    getProjectById,
    editProject,
    deleteProject,
} from "./controllers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const project_router = express.Router();

project_router.post("/add", VerifyToken, addProject);
project_router.get("/all", VerifyToken, getAllProjects);
project_router.get("/:id", VerifyToken, getProjectById);
project_router.put("/edit/:id", VerifyToken, editProject);
project_router.delete("/delete/:id", VerifyToken, deleteProject);

export default project_router;
