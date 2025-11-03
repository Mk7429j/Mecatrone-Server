import mongoose from "mongoose";

const { Schema, model } = mongoose;

// ===================================================
// 🧩 BANNER SCHEMA
// ===================================================
const bannerSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Banner name is required"],
            trim: true,
            maxlength: [100, "Banner name cannot exceed 100 characters"],
        },

        description: {
            type: String,
            required: [true, "Banner description is required"],
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },

        img: {
            type: String,
            required: [true, "Banner image is required"],
            trim: true,
        },

        position: {
            type: Number,
            required: [true, "Banner position is required"],
            unique: true, // 🔥 ensures no two banners share the same position
            min: [1, "Position must be at least 1"],
        },

        time: {
            type: Date,
            default: Date.now, // auto-assign creation time
        },

        is_active: {
            type: Boolean,
            default: true, // visible by default
        },
    },
    {
        collection: "banners",
        timestamps: true, // adds createdAt & updatedAt
    }
);

export const BannerSchema = model("Banner", bannerSchema);
