// helpers/mail.helper.js
import { transporter } from "../config/mail.config.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 📧 Universal Mail Sender with EJS Templates
 * @param {Object} options
 * @param {string} options.to - recipient
 * @param {string} options.subject - subject
 * @param {string} [options.template="custom"] - template name (e.g., enquiry, newsletter, passwordReset)
 * @param {Object} [options.data={}] - data for the template
 */
export const sendMail = async ({ to, subject, template = {}, data = {} }) => {
  try {
    if (!to || !subject) throw new Error("Missing required fields: 'to' or 'subject'");

    // 🧩 Path to EJS file
    const templatePath = path.join(__dirname, `../templates/${template}.ejs`);

    // 🖌️ Render HTML using EJS
    const html = await ejs.renderFile(templatePath, data);

    // ✉️ Send the mail
    const info = await transporter.sendMail({
      from: `"Mecatrone" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📨 [${template.toUpperCase()}] Mail sent to ${to} | ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
};
