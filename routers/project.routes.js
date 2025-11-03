// routers/projects.routes.js
import express from "express";
import {
    addProject,
    getAllProjects,
    getProjectById,
    editProject,
    deleteProject,
} from "./controllers_import.js";

const project_router = express.Router();

project_router.post("/add", addProject);
project_router.get("/all", getAllProjects);
project_router.get("/:id", getProjectById);
project_router.put("/edit/:id", editProject);
project_router.delete("/delete/:id", deleteProject);

export default project_router;
