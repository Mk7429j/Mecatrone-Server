// ---------------------------
//  🌐 Mecatrone Server Entry
// ---------------------------

import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { db_connection } from "./config/db.config.js";
import logger from "./utils/logger.js";
import Routes from "./routers/router_index.js";

// ---------------------------
//  🌱 Load environment variables
// ---------------------------
dotenv.config();

// ---------------------------
//  🧩 Resolve dirname
// ---------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------
//  ✅ Environment Sanity Check
// ---------------------------
if (!process.env.PORT || !process.env.MONGO_URI) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

// ---------------------------
//  🔹 Initialize Express App
// ---------------------------
const app = express();
app.set("trust proxy", 1);

// ---------------------------
//  🛡 Security & Middleware
// ---------------------------
app.use(
  helmet({
    contentSecurityPolicy: false, // disabled for API dev testing
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ✅ Rate limiting (150 requests / 15 mins)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ✅ CORS — restrict origins in production
const allowedOrigins = [
  "http://localhost:5173",
  "https://mecatrone.com",
  "https://admin.mecatrone.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ Body parsing & cookies
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Logging (dev only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Compression for responses
app.use(compression());

// ✅ Static files
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------
//  🧭 Health Check
// ---------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Mecatrone API is running smoothly...",
    env: process.env.NODE_ENV || "development",
  });
});

// ---------------------------
//  ⚙️ API Routes
// ---------------------------
app.use("/mec-api", Routes);

// ---------------------------
//  🧠 404 Handler
// ---------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `❌ Route ${req.originalUrl} not found.`,
  });
});

// ---------------------------
//  ⚠️ Global Error Handler
// ---------------------------
app.use((err, req, res, next) => {
  logger.error("Unhandled Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ---------------------------
//  🔥 Start Server
// ---------------------------
const PORT = process.env.PORT || 5000;

db_connection()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`✅ Server started at: http://localhost:${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

export default app;
