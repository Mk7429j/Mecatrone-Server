// config/db.js
import mongoose from "mongoose";
import logger from "../utils/logger.js"; // Centralized logger (like winston)

/**
 * 🧠 Connect to MongoDB (Atlas or Local)
 */
export const db_connection = async () => {
  const dbUri = process.env.MONGO_URI?.trim();

  // 🚨 Validate DB URI
  if (!dbUri) {
    logger.error("❌ MongoDB URI is not defined in environment variables!");
    process.exit(1);
  }

  try {
    // ✅ Connect (Mongoose v7+ automatically handles options)
    await mongoose.connect(dbUri);

    logger.info("✅ MongoDB connected successfully!");

    // 🔄 Handle runtime events
    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB disconnected!");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("🔄 MongoDB reconnected!");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("❌ MongoDB connection error:", err.message);
    });
  } catch (err) {
    logger.error(`❌ Initial MongoDB connection failed: ${err.message}`);

    // ⏳ Optional auto-retry after 5s (useful for Docker or CI)
    setTimeout(() => {
      logger.info("🔁 Retrying MongoDB connection...");
      db_connection();
    }, 5000);
  }
};
