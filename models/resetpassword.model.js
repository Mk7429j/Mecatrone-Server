// models/resetPassword.model.js
import mongoose from "mongoose";

const resetPasswordSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        reset_token: {
            type: String,
            required: true,
            index: true, // hashed token index
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // TTL index - deletes after expiry
        },
    },
    { timestamps: true }
);

export const ResetPasswordSchema = mongoose.model(
    "ResetPassword",
    resetPasswordSchema
);
