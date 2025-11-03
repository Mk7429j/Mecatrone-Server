// helpers/shared.helper.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * 🔐 Compare plain text password with hashed password
 * @param {string} plainText - Password entered by user
 * @param {string} hashText - Hashed password stored in DB
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (plainText, hashText) => {
  try {
    if (!plainText || !hashText) return false;
    return await bcrypt.compare(plainText, hashText);
  } catch (error) {
    console.error("❌ comparePassword error:", error.message);
    return false;
  }
};

/**
 * 🧂 Hash a plain text password using bcrypt
 * @param {string} password - The plain text password
 * @param {number} [saltRounds=12] - Salt complexity (default 12)
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password, saltRounds = 12) => {
  if (!password) throw new Error("Password is required for hashing");

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("❌ hashPassword error:", error.message);
    throw new Error("Failed to hash password");
  }
};

/**
 * 🔑 Generate a JWT token
 * @param {Object} payload - Data to include in token
 * @param {string} [expiresIn=process.env.JWT_EXPIRY || '1h'] - Token expiry duration
 * @returns {string} - Signed JWT token
 */
export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRY || "1h") => {
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  try {
    return jwt.sign(payload, secretKey, { expiresIn });
  } catch (error) {
    console.error("❌ generateToken error:", error.message);
    throw new Error("Failed to generate JWT token");
  }
};

/**
 * 🧩 Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded payload or null if invalid
 */
export const verificationToken = (token) => {
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    throw new Error("SECRET_KEY is not defined in environment variables");
  }

  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.warn("⚠️ Invalid or expired token");
    return null;
  }
};

// 🔹 Helper: Generate Public S3 URL
export const getS3Url = (bucket, key) => `https://${bucket}.s3.amazonaws.com/${key}`;
