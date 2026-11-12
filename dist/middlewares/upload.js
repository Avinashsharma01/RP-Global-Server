"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLandingMediaFile = exports.uploadProductImage = exports.uploadProjectGalleryImages = exports.uploadPartnerLogo = exports.uploadCertificateFile = exports.uploadProjectImage = exports.uploadResume = exports.uploadReport = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../config/cloudinary");
// Ensure local uploads folder exists for fallback storage
const uploadDir = path_1.default.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
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
const cloudinaryFileFilter = (_req, file, cb) => {
    if (mediaMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid upload type: ${file.mimetype}. Allowed formats: PDF, DOC, DOCX, JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, MOV.`));
    }
};
const mediaUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
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
const uploadMediaToCloudinary = (multerMiddleware, subFolder = "") => (req, res, next) => {
    multerMiddleware(req, res, async (error) => {
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
            await Promise.all(files.map(async (file) => {
                try {
                    const result = await (0, cloudinary_1.uploadBuffer)(file.buffer, file.originalname, targetFolder);
                    file.path = result.secure_url;
                    file.filename = result.public_id;
                    file.destination = "cloudinary";
                }
                catch (cloudErr) {
                    console.warn(`[Cloudinary Fallback] Upload failed for ${file.originalname} (${cloudErr.message}). Writing to local disk.`);
                    const ext = path_1.default.extname(file.originalname);
                    const baseName = path_1.default
                        .basename(file.originalname, ext)
                        .replace(/[^a-zA-Z0-9_-]/g, "_");
                    const localFileName = `${Date.now()}-${baseName}${ext}`;
                    const localFilePath = path_1.default.join(uploadDir, localFileName);
                    fs_1.default.writeFileSync(localFilePath, file.buffer);
                    file.path = `/uploads/${localFileName}`;
                    file.filename = localFileName;
                    file.destination = "local";
                }
            }));
            next();
        }
        catch (uploadError) {
            next(uploadError);
        }
    });
};
// Specific unified cloud upload middlewares
exports.uploadReport = uploadMediaToCloudinary(mediaUpload.single("waterReport"), "water-reports");
exports.uploadResume = uploadMediaToCloudinary(mediaUpload.single("resume"), "resumes");
exports.uploadProjectImage = uploadMediaToCloudinary(mediaUpload.single("image"), "gallery");
exports.uploadCertificateFile = uploadMediaToCloudinary(mediaUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), "certificates");
exports.uploadPartnerLogo = uploadMediaToCloudinary(mediaUpload.single("logo"), "partners");
exports.uploadProjectGalleryImages = uploadMediaToCloudinary(mediaUpload.array("images", 15), "gallery");
exports.uploadProductImage = uploadMediaToCloudinary(mediaUpload.single("image"), "products");
exports.uploadLandingMediaFile = uploadMediaToCloudinary(mediaUpload.fields([
    { name: "media", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), "landing");
//# sourceMappingURL=upload.js.map