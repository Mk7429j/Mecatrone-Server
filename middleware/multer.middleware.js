import multer from "multer";

// ✅ Allowed MIME types
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

// ✅ Use memory storage (for direct S3 upload)
const storage = multer.memoryStorage();

// ✅ File validation
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Invalid file type. Only images and PDFs are allowed."), false);
  }
};

// ✅ Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

export { upload };
