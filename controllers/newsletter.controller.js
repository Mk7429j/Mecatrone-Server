// controllers/newsletter.controller.js
import { NewsletterSchema } from "../models/models_import.js";
import { successResponse, errorResponse } from "../helpers/response.helper.js";
import { sendMail } from "../helpers/mail.helper.js";

// 🟢 Add Subscriber
export const addSubscriber = async (req, res) => {
    try {
        const { email } = req.body;

        // 🔹 1. Validate email
        if (!email) return errorResponse(res, "Subscriber email is required");

        // 🔹 2. Check existing
        const exists = await NewsletterSchema.findOne({ email });
        if (exists) return errorResponse(res, "Email already subscribed");

        // 🔹 3. Save to DB
        const newSubscriber = await NewsletterSchema.create({ email });

        // 🔹 4. Prepare mail content
        const mailOptions = {
            to: email,
            subject: "🎉 Welcome to Mecatronix Newsletter!",
            template: "newsletter",
        };

        // 🔹 5. Send mail
        const info = await sendMail(mailOptions);
        console.log("📩 Subscriber mail sent:", info.messageId);

        // 🔹 6. Send success response
        return successResponse(res, "✅ Subscribed and welcome email sent successfully", {
            subscriber: newSubscriber,
            messageId: info.messageId,
        });

    } catch (error) {
        console.error("❌ Failed to add subscriber:", error);
        return errorResponse(res, "Failed to subscribe user", error.message);
    }
};


// 🟣 Get All Subscribers (with aggregate counts & daily stats)
export const getAllSubscribers = async (req, res) => {
    try {
        const pipeline = [
            {
                $facet: {
                    totalSubscribers: [{ $count: "count" }],
                    subscribers: [
                        { $sort: { subscribedAt: -1 } },
                        {
                            $project: {
                                email: 1,
                                subscribedAt: 1,
                                date: {
                                    $dateToString: { format: "%Y-%m-%d", date: "$subscribedAt" },
                                },
                            },
                        },
                    ],
                    dailyStats: [
                        {
                            $group: {
                                _id: {
                                    $dateToString: { format: "%Y-%m-%d", date: "$subscribedAt" },
                                },
                                count: { $sum: 1 },
                            },
                        },
                        { $sort: { _id: -1 } },
                    ],
                },
            },
        ];

        const result = await NewsletterSchema.aggregate(pipeline);

        const data = {
            total: result[0]?.totalSubscribers[0]?.count || 0,
            subscribers: result[0]?.subscribers || [],
            dailyStats: result[0]?.dailyStats || [],
        };

        return successResponse(res, "📊 Subscribers fetched successfully", data);
    } catch (error) {
        console.error("❌ Get Subscribers Error:", error);
        return errorResponse(res, "Failed to fetch subscribers", error.message);
    }
};


// 🔴 Delete Single or Multiple Subscribers (same API)
export const deleteSubscribers = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting { ids: ["id1", "id2", ...] }

        if (!ids || ids.length === 0)
            return errorResponse(res, "No subscriber IDs provided");

        const result = await NewsletterSchema.deleteMany({
            _id: { $in: ids },
        });

        if (result.deletedCount === 0)
            return errorResponse(res, "No subscribers found to delete");

        return successResponse(
            res,
            `🗑️ ${result.deletedCount} subscriber(s) deleted successfully`
        );
    } catch (error) {
        console.error("❌ Delete Subscribers Error:", error);
        return errorResponse(res, "Failed to delete subscribers", error.message);
    }
};
