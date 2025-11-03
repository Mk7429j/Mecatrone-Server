// ==============================
// 📧 Mail Configuration
// ==============================
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create transporter
export const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_PORT === "465", // true for 465, false for others
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // allows self-signed certs if using custom SMTP
    },
});

// Verify connection (optional, but helpful for debugging)
export const verifyMailConnection = async () => {
    try {
        await transporter.verify();
        console.log("✅ Mail server is ready to send messages.");
    } catch (error) {
        console.error("❌ Mail server connection failed:", error.message);
    }
};
