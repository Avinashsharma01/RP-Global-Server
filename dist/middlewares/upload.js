"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProjectGalleryImages = exports.uploadPartnerLogo = exports.uploadCertificateFile = exports.uploadProjectImage = exports.uploadResume = exports.uploadReport = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure uploads folder exists
const uploadDir = path_1.default.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        // Generate clean safe filename with timestamp
        const ext = path_1.default.extname(file.originalname);
        const baseName = path_1.default
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
const fileFilter = (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type: ${file.mimetype}. Allowed formats: PDF, DOC, DOCX, JPG, PNG, WEBP.`));
    }
};
const maxSizeBytes = 10 * 1024 * 1024; // 10MB
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: maxSizeBytes },
    fileFilter,
});
// Specific upload middlewares
exports.uploadReport = exports.upload.single("waterReport");
exports.uploadResume = exports.upload.single("resume");
exports.uploadProjectImage = exports.upload.single("image");
exports.uploadCertificateFile = exports.upload.fields([
    { name: "image", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
    { name: "file", maxCount: 1 },
]);
exports.uploadPartnerLogo = exports.upload.single("logo");
exports.uploadProjectGalleryImages = exports.upload.array("images", 15);
//# sourceMappingURL=upload.js.map