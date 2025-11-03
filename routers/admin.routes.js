import { Router } from "express";
import { addAdmin, getAdmin, deleteAdmin, updateAdmin } from "./controllers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const admin_routers = Router();

admin_routers.post("/add_admin", addAdmin);
admin_routers.get("/get_admin/:id", VerifyToken, getAdmin);
admin_routers.put("/update_admin/:id", VerifyToken, updateAdmin);
admin_routers.delete("/delete_admin/:id", VerifyToken, deleteAdmin);

export default admin_routers; // ✅ export the router directly
