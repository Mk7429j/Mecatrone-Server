import express from "express";
import {
    addEnquiry,
    getAllEnquiries,
    getEnquiryById,
    editEnquiry,
    deleteEnquiry,
} from "./controllers_import.js";
import { VerifyToken } from "../middleware/token.middleware.js";

const enquiry_router = express.Router();

enquiry_router.post("/add", addEnquiry);
enquiry_router.get("/getall", VerifyToken, getAllEnquiries);
enquiry_router.get("/get/:id", VerifyToken, getEnquiryById);
enquiry_router.put("/edit/:id", VerifyToken, editEnquiry);
enquiry_router.delete("/delete/:id", VerifyToken, deleteEnquiry);

export default enquiry_router;
