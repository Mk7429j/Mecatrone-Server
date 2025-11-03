import { Router } from "express";
import {
    login,
    changePassword,
    checkLoginStatus,
    logout,
    forgotPassword,
    resetPassword,
    verifyResetToken,
} from "./controllers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";
import { asyncHandler } from "../helpers/response.helper.js";

const auth_routes = Router();

// 🔐 Auth routes
auth_routes.post("/login", asyncHandler(login));
auth_routes.post("/change_password", VerifyToken, changePassword);
auth_routes.get("/check_login", VerifyToken, checkLoginStatus);
auth_routes.post("/logout", VerifyToken, logout);

// 🔑 Password reset routes
auth_routes.post("/forgot_password", forgotPassword);
auth_routes.post("/reset_password", resetPassword);
auth_routes.post("/verifyresettoken", verifyResetToken);

export default auth_routes;
