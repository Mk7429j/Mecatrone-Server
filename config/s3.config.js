// config/s3.config.js
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

let s3;

if (
  !process.env.MY_AWS_ACCESS_KEY_ID ||
  !process.env.MY_AWS_SECRET_ACCESS_KEY ||
  !process.env.MY_AWS_REGION
) {
  console.warn("⚠️ Missing AWS credentials in .env file");
}

try {
  s3 = new S3Client({
    region: process.env.MY_AWS_REGION, // Example: "ap-south-1"
    credentials: {
      accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    },
  });

  if (process.env.NODE_ENV === "development") {
    console.log("✅ S3 client initialized successfully");
  }
} catch (error) {
  console.error("❌ Failed to initialize S3 client:", error);
  s3 = null;
}

export { s3 };
