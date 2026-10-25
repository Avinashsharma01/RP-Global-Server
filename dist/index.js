"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const db_1 = require("./config/db");
const errorHandler_1 = require("./middlewares/errorHandler");
// Import route modules
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const rfqRoutes_1 = __importDefault(require("./routes/rfqRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const galleryRoutes_1 = __importDefault(require("./routes/galleryRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const certificateRoutes_1 = __importDefault(require("./routes/certificateRoutes"));
const partnerRoutes_1 = __importDefault(require("./routes/partnerRoutes"));
const faqRoutes_1 = __importDefault(require("./routes/faqRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
// Security & utility middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows frontend to load images from /uploads
}));
app.use((0, cors_1.default)({
    origin: [
        CLIENT_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "15mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "15mb" }));
// Static file hosting for uploaded water reports, resumes, and media
const uploadDir = path_1.default.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
app.use("/uploads", express_1.default.static(uploadDir));
// Root service welcome
app.get("/", (_req, res) => {
    res.status(200).json({
        service: "R P Global Projects - Centralized REST API",
        version: "1.0.0",
        status: "online",
        documentation: "/api/v1/health",
    });
});
// Health check endpoint
app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
            connected: (0, db_1.isDBConnected)(),
            provider: "MongoDB (Mongoose)",
        },
    });
});
// Guard middleware to prevent command buffering hangs when DB is unreachable
const requireDatabase = (_req, res, next) => {
    if (!(0, db_1.isDBConnected)()) {
        res.status(503).json({
            success: false,
            message: "Database service is temporarily unavailable. Operating in offline fallback mode.",
            code: "DATABASE_UNAVAILABLE",
        });
        return;
    }
    next();
};
// Mount API routes guarded by database availability
app.use("/api/v1/auth", requireDatabase, authRoutes_1.default);
app.use("/api/v1/products", requireDatabase, productRoutes_1.default);
app.use("/api/v1/rfq", requireDatabase, rfqRoutes_1.default);
app.use("/api/v1/jobs", requireDatabase, jobRoutes_1.default);
app.use("/api/v1/gallery", requireDatabase, galleryRoutes_1.default);
app.use("/api/v1/admin", requireDatabase, adminRoutes_1.default);
app.use("/api/v1/certificates", certificateRoutes_1.default);
app.use("/api/v1/partners", partnerRoutes_1.default);
app.use("/api/v1/faqs", faqRoutes_1.default);
// 404 Route handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Requested API route does not exist.",
    });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
// Start server and initialize database
const startServer = async () => {
    await (0, db_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`  R P GLOBAL PROJECTS — REST API SERVER             `);
        console.log(`  Listening on: http://localhost:${PORT}             `);
        console.log(`  Allowed Client: ${CLIENT_URL}                     `);
        console.log(`  Uploads Directory: ${uploadDir}                   `);
        console.log(`====================================================`);
    });
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map