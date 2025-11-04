import {
    BannerSchema,
    BlogSchema,
    ClientSchema,
    WorkSchema,
    ProjectSchema,
    ReviewSchema,
    EnquirySchema,
    NewsletterSchema,
    AdminSchema,
} from "../models/models_import.js";

import { successResponse, errorResponse } from "../helpers/response.helper.js";

// ===================================================
// 📊 DASHBOARD STATS CONTROLLER
// ===================================================
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
            subscribers,
            admins,
        ] = await Promise.all([
            BannerSchema.aggregate([{ $count: "total" }]),
            BlogSchema.aggregate([{ $count: "total" }]),
            ClientSchema.aggregate([{ $count: "total" }]),
            WorkSchema.aggregate([{ $count: "total" }]), // ✅ Works total count
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
            NewsletterSchema.aggregate([{ $count: "total" }]),
            AdminSchema.aggregate([
                {
                    $group: {
                        _id: "$role", // role: 'admin' | 'superadmin'
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        // 🧮 Review stats
        const reviewCounts = {
            verified: reviews.find((r) => r._id === true)?.count || 0,
            unverified: reviews.find((r) => r._id === false)?.count || 0,
            total: reviews.reduce((a, b) => a + b.count, 0),
        };

        // 🧮 Enquiry stats
        const enquiryCounts = {
            opened: enquiries.find((e) => e._id === true)?.count || 0,
            unopened: enquiries.find((e) => e._id === false)?.count || 0,
            total: enquiries.reduce((a, b) => a + b.count, 0),
        };

        // 🧮 Admin stats
        const adminCounts = {
            superadmin: admins.find((a) => a._id === "superadmin")?.count || 0,
            admin: admins.find((a) => a._id === "admin")?.count || 0,
            total: admins.reduce((a, b) => a + b.count, 0),
        };

        // ✅ Combine all stats
        const stats = {
            banners: banners[0]?.total || 0,
            blogs: blogs[0]?.total || 0,
            clients: clients[0]?.total || 0,
            works: works[0]?.total || 0, // ✅ Added works count properly here
            projects: projects[0]?.total || 0,
            reviews: reviewCounts,
            enquiries: enquiryCounts,
            subscribers: subscribers[0]?.total || 0,
            admins: adminCounts,
        };

        return successResponse(
            res,
            "📊 Dashboard data fetched successfully",
            stats
        );
    } catch (error) {
        console.error("❌ Dashboard error:", error);
        return errorResponse(res, "Failed to fetch dashboard stats", error.message);
    }
};
