import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Generate clean safe filename with timestamp
    const ext = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${Date.now()}-${baseName}${ext}`);
  },
});

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed formats: PDF, DOC, DOCX, JPG, PNG, WEBP.`
      )
    );
  }
};

const maxSizeBytes = 10 * 1024 * 1024; // 10MB

export const upload = multer({
  storage,
  limits: { fileSize: maxSizeBytes },
  fileFilter,
});

// Specific upload middlewares
export const uploadReport = upload.single("waterReport");
export const uploadResume = upload.single("resume");
export const uploadProjectImage = upload.single("image");
export const uploadCertificateFile = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);
export const uploadPartnerLogo = upload.single("logo");
export const uploadProjectGalleryImages = upload.array("images", 15);

