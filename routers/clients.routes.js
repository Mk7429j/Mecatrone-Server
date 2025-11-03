import express from "express";
import {
  addClient,
  getAllClients,
  getClientById,
  editClient,
  deleteClient,
} from "./controllers_import.js";

const client_router = express.Router();

client_router.post("/add_client", addClient);
client_router.get("/get_all_clients", getAllClients);
client_router.get("/get_client/:id", getClientById);
client_router.put("/edit_client/:id", editClient);
client_router.delete("/delete_client/:id", deleteClient);

export default client_router;
