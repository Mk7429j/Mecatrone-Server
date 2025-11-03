// controllers/auth.controller.js
import crypto from "crypto";
import _ from "lodash";
import { AdminSchema } from "../models/models_import.js";
import { ResetPasswordSchema } from "../models/models_import.js"; // ✅ Create this model
import {
  comparePassword,
  generateToken,
  hashPassword,
  verificationToken,
} from "../helpers/shared.helper.js";
import {
  successResponse,
  errorResponse,
} from "../helpers/response.helper.js";
import {
  INVALID_ACCOUNT_DETAILS,
  INCORRECT_PASSWORD,
  LOGIN_SUCCESS,
  PASSWORD_CHANGED_SUCCESSFULLY,
  PASSWORD_CHANGED_FAILED,
} from "../helpers/message.helper.js";
import { sendMail } from "../helpers/mail.helper.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://mecatrone.com";

/* ======================================================
   🔹 LOGIN CONTROLLER
   ====================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return errorResponse(res, "Email and password are required", 400);

    const user = await AdminSchema.findOne({ email }).lean();
    if (!user) return errorResponse(res, INVALID_ACCOUNT_DETAILS, 401);

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid)
      return errorResponse(res, INCORRECT_PASSWORD, 401);

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = await generateToken(payload);

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    const safeUser = _.omit(user, ["password"]);
    return successResponse(res, LOGIN_SUCCESS, safeUser);
  } catch (err) {
    console.error("🚨 Login Error:", err);
    return errorResponse(res, "An error occurred while logging in", 500);
  }
};

/* ======================================================
   🔹 CHANGE PASSWORD
   ====================================================== */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userData?.id;

    if (!userId) return errorResponse(res, "Unauthorized", 401);
    if (!oldPassword || !newPassword)
      return errorResponse(res, "Both old and new passwords are required", 400);

    const user = await AdminSchema.findById(userId);
    if (!user) return errorResponse(res, "User not found", 404);

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) return errorResponse(res, INCORRECT_PASSWORD, 400);

    user.password = await hashPassword(newPassword);
    await user.save();

    return successResponse(res, PASSWORD_CHANGED_SUCCESSFULLY);
  } catch (err) {
    console.error("🚨 Change Password Error:", err);
    return errorResponse(res, PASSWORD_CHANGED_FAILED, 500);
  }
};

/* ======================================================
   🔹 CHECK LOGIN STATUS
   ====================================================== */
export const checkLoginStatus = async (req, res) => {
  try {
    const token = req.cookies?.admin_token;
    if (!token) return errorResponse(res, "Unauthorized access", 401);

    const decoded = await verificationToken(token);
    if (!decoded?.id) return errorResponse(res, "Invalid token", 401);

    const user = await AdminSchema.findById(decoded.id).select("-password");
    if (!user) return errorResponse(res, "User not found", 404);

    return successResponse(res, "Already logged in", user);
  } catch (err) {
    console.error("🚨 Check Login Status Error:", err);
    return errorResponse(res, "Server error", 500);
  }
};

/* ======================================================
   🔹 FORGOT PASSWORD - Request Reset Link
   ====================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return errorResponse(res, "Email is required");

    const user = await AdminSchema.findOne({ email });
    if (!user) return errorResponse(res, "Account not found");

    // 1️⃣ Generate reset token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // 2️⃣ Hash before saving
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // 3️⃣ Set expiry (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 4️⃣ Remove old reset requests for same user (optional)
    await ResetPasswordSchema.deleteMany({ user_id: user._id });

    // 5️⃣ Save new token
    await ResetPasswordSchema.create({
      user_id: user._id,
      reset_token: hashedToken,
      expiresAt,
    });

    // 6️⃣ Build reset URL
    const resetLink = `${FRONTEND_URL}/reset-password/${rawToken}`;

    // 7️⃣ Send email
    await sendMail({
      to: user.email,
      subject: "Reset Your Mecatrone Password",
      type: "passwordReset",
      data: { resetLink },
    });

    return successResponse(res, "Password reset email sent successfully");
  } catch (error) {
    console.error("🚨 Forgot Password Error:", error);
    return errorResponse(res, "Failed to send reset link", 500);
  }
};


/* ======================================================
   🔹 RESET PASSWORD - After Clicking Email Link
   ====================================================== */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return errorResponse(res, "Token and new password are required");

    // 1️⃣ Hash the token to match stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2️⃣ Find valid reset request
    const resetRecord = await ResetPasswordSchema.findOne({
      reset_token: hashedToken,
      expiresAt: { $gt: new Date() }, // ensure not expired
    });

    if (!resetRecord)
      return errorResponse(res, "Invalid or expired reset token", 400);

    // 3️⃣ Find user
    const user = await AdminSchema.findById(resetRecord.user_id);
    if (!user) return errorResponse(res, "User not found", 404);

    // 4️⃣ Hash new password and save
    user.password = await hashPassword(newPassword);
    await user.save();

    // 5️⃣ Delete used token (prevent reuse)
    await ResetPasswordSchema.deleteMany({ user_id: user._id });

    return successResponse(res, "Password reset successful");
  } catch (error) {
    console.error("🚨 Reset Password Error:", error);
    return errorResponse(res, "Password reset failed", 500);
  }
};


/* ======================================================
   🔹 LOGOUT
   ====================================================== */
export const logout = async (req, res) => {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });
    return successResponse(res, "Logged out successfully");
  } catch (err) {
    console.error("🚨 Logout Error:", err);
    return errorResponse(res, "Logout failed", 500);
  }
};
