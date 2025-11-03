// config/s3.config.js
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const { MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY, MY_AWS_REGION } = process.env;

if (!MY_AWS_ACCESS_KEY_ID || !MY_AWS_SECRET_ACCESS_KEY || !MY_AWS_REGION) {
  throw new Error("❌ Missing AWS credentials or region in .env");
}

export const s3 = new S3Client({
  region: MY_AWS_REGION,
  credentials: {
    accessKeyId: MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: MY_AWS_SECRET_ACCESS_KEY,
  },
});

console.log(`✅ S3 initialized for region: ${MY_AWS_REGION}`);
