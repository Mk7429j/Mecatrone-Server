// controllers/image.controller.js
import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.config.js";
import dotenv from "dotenv";

dotenv.config();

const getS3Url = (bucket, key) =>
  `https://${bucket}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/${key}`;

// 📤 Upload single or multiple images
export const uploadImage = async (req, res) => {
  try {
    const files = req.files?.length ? req.files : req.file ? [req.file] : [];

    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "No files provided" });
    }

    // ✅ Validate file types before upload
    const allowedTypes = ["image/", "application/pdf"];
    const invalidFile = files.find(
      (file) => !allowedTypes.some((type) => file.mimetype.startsWith(type))
    );

    if (invalidFile) {
      return res
        .status(400)
        .json({ success: false, message: `Invalid file type: ${invalidFile.mimetype}` });
    }

    const uploadedUrls = [];

    for (const file of files) {
      const fileKey = `uploads/${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;

      console.log(`✅ Uploading: ${file.originalname} → ${fileKey}`);

      const params = {
        Bucket: process.env.MY_AWS_BUCKET,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));

      uploadedUrls.push({
        url: getS3Url(process.env.MY_AWS_BUCKET, fileKey),
        name: file.originalname,
        type: file.mimetype,
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ File(s) uploaded successfully",
      files: uploadedUrls,
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};

// 🗑️ Delete single or multiple images
export const deleteImage = async (req, res) => {
  try {
    let { urls } = req.body;

    // ✅ Handle single string or missing array
    if (!urls) {
      return res.status(400).json({
        success: false,
        message: "No image URLs provided in request body",
      });
    }

    if (typeof urls === "string") urls = [urls]; // convert single string to array

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid image URLs format",
      });
    }

    // ✅ Extract S3 keys from URLs
    const keys = urls
      .map((url) => {
        try {
          const match = url.split(".amazonaws.com/")[1];
          return match?.trim() || null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (keys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or malformed URL(s)",
      });
    }

    // ✅ Delete from S3 (single or multiple)
    if (keys.length === 1) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.MY_AWS_BUCKET,
          Key: keys[0],
        })
      );
    } else {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: process.env.MY_AWS_BUCKET,
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        })
      );
    }

    console.log("🗑️ Deleted files:", keys);

    return res.status(200).json({
      success: true,
      message: "🗑️ File(s) deleted successfully",
      deleted: keys,
    });
  } catch (error) {
    console.error("❌ Delete failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete file(s)",
      error: error.message,
    });
  }
};
