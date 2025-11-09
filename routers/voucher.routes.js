import express from "express";
import {
  addVoucher,
  getAllVouchers,
  getVoucherById,
  deleteVoucher,
} from "./controllers_import.js";

const voucher_router = express.Router();

voucher_router.post("/add", addVoucher);
voucher_router.get("/all", getAllVouchers);
voucher_router.get("/:id", getVoucherById);
voucher_router.delete("/delete/:id", deleteVoucher);

export default voucher_router;
