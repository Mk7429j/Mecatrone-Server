// controllers/dashboard.controller.js
import {
    BannerSchema,
    BlogSchema,
    ClientSchema,
    WorkSchema,
    ProjectSchema,
    ReviewSchema,
    EnquirySchema,
    NewsletterSchema, // ✅ added
} from "../models/models_import.js";

import { successResponse, errorResponse } from "../helpers/response.helper.js";

export const getDashboardStats = async (req, res) => {
    try {
        const [
            banners,
            blogs,
            clients,
            works,
            projects,
            reviews,
            enquiries,
            subscribers, // ✅ added
        ] = await Promise.all([
            BannerSchema.aggregate([{ $count: "total" }]),
            BlogSchema.aggregate([{ $count: "total" }]),
            ClientSchema.aggregate([{ $count: "total" }]),
            WorkSchema.aggregate([{ $count: "total" }]),
            ProjectSchema.aggregate([{ $count: "total" }]),
            ReviewSchema.aggregate([
                {
                    $group: {
                        _id: "$verified",
                        count: { $sum: 1 },
                    },
                },
            ]),
            EnquirySchema.aggregate([
                {
                    $group: {
                        _id: "$opened",
                        count: { $sum: 1 },
                    },
                },
            ]),
            NewsletterSchema.aggregate([{ $count: "total" }]), // ✅ added
        ]);

        // 🧮 Format review counts
        const reviewCounts = {
            verified: reviews.find(r => r._id === true)?.count || 0,
            unverified: reviews.find(r => r._id === false)?.count || 0,
            total: reviews.reduce((a, b) => a + b.count, 0),
        };

        // 🧮 Format enquiry counts
        const enquiryCounts = {
            opened: enquiries.find(e => e._id === true)?.count || 0,
            unopened: enquiries.find(e => e._id === false)?.count || 0,
            total: enquiries.reduce((a, b) => a + b.count, 0),
        };

        // 🧮 Combine all stats
        const stats = {
            banners: banners[0]?.total || 0,
            blogs: blogs[0]?.total || 0,
            clients: clients[0]?.total || 0,
            works: works[0]?.total || 0,
            projects: projects[0]?.total || 0,
            reviews: reviewCounts,
            enquiries: enquiryCounts,
            subscribers: subscribers[0]?.total || 0, // ✅ added
        };

        return successResponse(res, "📊 Dashboard data fetched successfully", stats);
    } catch (error) {
        console.error("❌ Dashboard error:", error);
        return errorResponse(res, "Failed to fetch dashboard stats", error.message);
    }
};
