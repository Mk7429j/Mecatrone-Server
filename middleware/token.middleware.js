import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

/**
 * 🔒 Verify JWT token from cookie or Authorization header
 */
export const VerifyToken = (req, res, next) => {
  try {
    // 1️⃣ Extract token from cookie or Bearer header
    const token =
      req.cookies?.admin_token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      logger.warn("⛔ Unauthorized: Token missing");
      return res.status(401).json({
        success: false,
        message: "Access denied. Token required.",
      });
    }

    // 2️⃣ Verify token using SECRET_KEY
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 3️⃣ Attach user data to request
    req.userData = decoded;

    // 4️⃣ Continue to next middleware or route
    next();
  } catch (err) {
    logger.error("🚫 JWT Verification Error:", err.message);

    let message = "Unauthorized or expired token";
    if (err.name === "TokenExpiredError") message = "Session expired. Please log in again.";
    if (err.name === "JsonWebTokenError") message = "Invalid authentication token.";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};
