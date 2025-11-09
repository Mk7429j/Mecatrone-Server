import { NewsletterSchema, VoucherSchema } from "../models/models_import.js";
import { sendMail } from "../helpers/mail.helper.js";
import { successResponse, errorResponse } from "../helpers/response.helper.js";

/* ======================================================
   🔹 ADD VOUCHER + SEND TO SUBSCRIBERS
   ====================================================== */
export const addVoucher = async (req, res) => {
    try {
        const { title, img, heading, msg } = req.body;

        if (!title?.trim() || !msg?.length) {
            return errorResponse(res, "Title and message are required.", 400);
        }

        // 1️⃣ Save new voucher in DB
        const newVoucher = new VoucherSchema({
            title,
            img: img || [],
            heading: heading || [],
            msg,
        });

        const savedVoucher = await newVoucher.save();

        // 2️⃣ Get all subscribers
        const subscribers = await NewsletterSchema.find({}, "email");

        if (!subscribers.length) {
            console.warn("⚠️ No subscribers found. Voucher saved but no emails sent.");
            return successResponse(res, "Voucher added (no subscribers found)", savedVoucher);
        }

        // ✅ 3️⃣ Batch send emails with new template
        const batchSize = 200; // adjust for your mail provider limit
        const delayMs = 1000; // 1 second delay between batches

        const sendBatch = async (batch) => {
            await Promise.allSettled(
                batch.map((sub) =>
                    sendMail({
                        to: sub.email,
                        subject: `🚀 ${title} - MECATRONIX Update`,
                        template: "voucher", // Updated template name
                        data: {
                            title: title,
                            heading: heading?.[0] || "",
                            message: msg?.[0] || "",
                            images: img || [], // Send all images for the grid
                            websiteUrl: process.env.FRONTEND_URL || "https://mecatronix.com",
                            unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(sub.email)}`
                        },
                    })
                )
            );
        };

        // Split into batches
        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize);
            console.log(`📤 Sending batch ${i / batchSize + 1} of ${Math.ceil(subscribers.length / batchSize)}`);
            await sendBatch(batch);
            if (i + batchSize < subscribers.length) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }

        console.log(`✅ Update sent to ${subscribers.length} subscribers`);
        return successResponse(res, "✅ Voucher added and emails sent successfully", savedVoucher);
    } catch (error) {
        console.error("🚨 addVoucher Error:", error);
        return errorResponse(res, "Failed to add voucher", 500);
    }
};

/* ======================================================
   🔹 GET ALL VOUCHERS
   ====================================================== */
export const getAllVouchers = async (req, res) => {
    try {
        const vouchers = await VoucherSchema.find().sort({ createdAt: -1 });
        return successResponse(res, "Voucher list fetched successfully", vouchers);
    } catch (error) {
        console.error("🚨 getAllVouchers Error:", error);
        return errorResponse(res, "Failed to fetch vouchers", 500);
    }
};

/* ======================================================
   🔹 GET SINGLE VOUCHER BY ID
   ====================================================== */
export const getVoucherById = async (req, res) => {
    try {
        const { id } = req.params;
        const voucher = await VoucherSchema.findById(id);
        if (!voucher) return errorResponse(res, "Voucher not found", 404);

        return successResponse(res, "Voucher fetched successfully", voucher);
    } catch (error) {
        console.error("🚨 getVoucherById Error:", error);
        return errorResponse(res, "Failed to fetch voucher", 500);
    }
};

/* ======================================================
   🔹 DELETE VOUCHER
   ====================================================== */
export const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await VoucherSchema.findByIdAndDelete(id);
        if (!deleted) return errorResponse(res, "Voucher not found", 404);

        return successResponse(res, "Voucher deleted successfully");
    } catch (error) {
        console.error("🚨 deleteVoucher Error:", error);
        return errorResponse(res, "Failed to delete voucher", 500);
    }
};
