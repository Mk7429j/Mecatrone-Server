import express from "express";
import {
    addBanner,
    getAllBanners,
    getBannerById,
    editBanner,
    deleteBanner,
} from "./controllers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const banner_router = express.Router();

banner_router.post("/add", VerifyToken, addBanner);        // ➕ Add new banner
banner_router.get("/get", getAllBanners);     // 📜 Get all banners
banner_router.get("/get/:id", VerifyToken, getBannerById); // 🔍 Get banner by ID
banner_router.put("/edit/:id", VerifyToken, editBanner);   // ✏️ Edit banner
banner_router.delete("/delete/:id", VerifyToken, deleteBanner); // ❌ Delete banner

export default banner_router;
