import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "./env";
import { randomUUID } from "crypto";

const isProduction = process.env.NODE_ENV === "production";

const uploadPath = isProduction
  ? path.join("/tmp", env.UPLOAD_PATH)
  : path.join(__dirname, env.UPLOAD_PATH);

// define the storage configuration but delay directory creation until needed
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ensure the directory exists at runtime
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Fixed: removed extra trailing curly brace before ${ext}
    cb(null, `${req.user?._id}-${Date.now()}-${randomUUID()}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Allowed extensions matching your frontend allowed types
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".csv",
    ".txt",
    ".png",
    ".jpg",
    ".jpeg",
    ".mp4",
    ".mov",
    ".zip",
  ];

  // Allowed MIME types
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "text/plain",
    "image/jpeg",
    "image/png",
    "video/mp4",
    "video/quicktime",
    "application/zip",
    "application/x-zip-compressed",
  ];

  const okExt = allowedExtensions.includes(ext);
  const okMime = allowedMimeTypes.includes(file.mimetype);

  if (!okExt || !okMime) {
    const err = new Error(
      "Wrong file format. Allowed formats: PDF, DOCX, XLSX, CSV, TXT, PNG, JPG, MP4, MOV, ZIP."
    ) as any;
    err.code = "INVALID_FILE_TYPE";
    return cb(err);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB limit matching frontend UI description
  },
});

export default upload;