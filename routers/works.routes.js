import express from "express";
import {
  addWork,
  getAllWorks,
  getWorkById,
  editWork,
  deleteWork,
} from "./controllers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const works_router = express.Router();

works_router.post("/add", addWork);
works_router.get("/get", getAllWorks);
works_router.get("/get/:id", VerifyToken, getWorkById);
works_router.put("/edit/:id", VerifyToken, editWork);
works_router.delete("/delete/:id", VerifyToken, deleteWork);

export default works_router;
