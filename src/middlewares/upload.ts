import multer from "multer";
import path from "path";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import { uploadBuffer } from "../config/cloudinary";

// Ensure local uploads folder exists for fallback storage
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const mediaMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const cloudinaryFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (mediaMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid upload type: ${file.mimetype}. Allowed formats: PDF, DOC, DOCX, JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, MOV.`
      )
    );
  }
};

const mediaUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.CLOUDINARY_MAX_FILE_SIZE_MB || 100) * 1024 * 1024,
  },
  fileFilter: cloudinaryFileFilter,
});

/**
 * Higher-order middleware that intercepts multipart files stored in memory,
 * streams them to Cloudinary under the designated folder, and sets file.path
 * to the permanent HTTPS Cloudinary URL (with local disk fallback if offline).
 */
const uploadMediaToCloudinary = (
  multerMiddleware: (req: Request, res: Response, next: NextFunction) => void,
  subFolder = ""
) => (req: Request, res: Response, next: NextFunction): void => {
  multerMiddleware(req, res, async (error: unknown) => {
    if (error) {
      next(error);
      return;
    }

    const files = req.files
      ? Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat()
      : req.file
        ? [req.file]
        : [];

    if (files.length === 0) {
      next();
      return;
    }

    const baseFolder = process.env.CLOUDINARY_FOLDER || "rp-global";
    const targetFolder = subFolder ? `${baseFolder}/${subFolder}` : baseFolder;

    try {
      await Promise.all(
        files.map(async (file) => {
          try {
            const result = await uploadBuffer(file.buffer, file.originalname, targetFolder);
            file.path = result.secure_url;
            file.filename = result.public_id;
            file.destination = "cloudinary";
          } catch (cloudErr: any) {
            console.warn(
              `[Cloudinary Fallback] Upload failed for ${file.originalname} (${cloudErr.message}). Writing to local disk.`
            );
            const ext = path.extname(file.originalname);
            const baseName = path
              .basename(file.originalname, ext)
              .replace(/[^a-zA-Z0-9_-]/g, "_");
            const localFileName = `${Date.now()}-${baseName}${ext}`;
            const localFilePath = path.join(uploadDir, localFileName);
            fs.writeFileSync(localFilePath, file.buffer);
            file.path = `/uploads/${localFileName}`;
            file.filename = localFileName;
            file.destination = "local";
          }
        })
      );
      next();
    } catch (uploadError) {
      next(uploadError);
    }
  });
};

// Specific unified cloud upload middlewares
export const uploadReport = uploadMediaToCloudinary(
  mediaUpload.single("waterReport"),
  "water-reports"
);

export const uploadResume = uploadMediaToCloudinary(
  mediaUpload.single("resume"),
  "resumes"
);

export const uploadProjectImage = uploadMediaToCloudinary(
  mediaUpload.single("image"),
  "gallery"
);

export const uploadCertificateFile = uploadMediaToCloudinary(
  mediaUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  "certificates"
);

export const uploadPartnerLogo = uploadMediaToCloudinary(
  mediaUpload.single("logo"),
  "partners"
);

export const uploadProjectGalleryImages = uploadMediaToCloudinary(
  mediaUpload.array("images", 15),
  "gallery"
);

export const uploadProductImage = uploadMediaToCloudinary(
  mediaUpload.single("image"),
  "products"
);

export const uploadLandingMediaFile = uploadMediaToCloudinary(
  mediaUpload.fields([
    { name: "media", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  "landing"
);
