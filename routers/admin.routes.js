import { Router } from "express";
import { addAdmin, getAdmin, deleteAdmin, updateAdmin, getAllAdmin } from "./controllers_import.js";

const admin_routers = Router();

admin_routers.post("/add_admin", addAdmin);
admin_routers.get("/get_admin/:id", getAdmin);
admin_routers.get("/get_all_admins", getAllAdmin);
admin_routers.put("/update_admin/:id", updateAdmin);
admin_routers.delete("/delete_admin/:id", deleteAdmin);

export default admin_routers; // ✅ export the router directly
