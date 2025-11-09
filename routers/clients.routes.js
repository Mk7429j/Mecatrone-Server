import express from "express";
import {
  addClient,
  getAllClients,
  getClientById,
  editClient,
  deleteClient,
} from "./controllers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const client_router = express.Router();

client_router.post("/add_client", VerifyToken, addClient);
client_router.get("/get_all_clients", VerifyToken, getAllClients);
client_router.get("/get_client/:id", VerifyToken, getClientById);
client_router.put("/edit_client/:id", VerifyToken, editClient);
client_router.delete("/delete_client/:id", VerifyToken, deleteClient);

export default client_router;
