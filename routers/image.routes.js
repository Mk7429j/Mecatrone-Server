// routes/image.route.js
import express from "express";
import { uploadImage, deleteImage } from "../routers/controllers_import.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// ✅ Upload single or multiple images (same endpoint)
router.post(
    "/upload",
    upload.array("images", 10), // Supports multiple uploads
    uploadImage
);

// ✅ Delete one or multiple images
router.delete("/delete", deleteImage);

export default router;
