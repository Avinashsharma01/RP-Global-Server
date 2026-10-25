import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { connectDB, isDBConnected } from "./config/db";
import { errorHandler } from "./middlewares/errorHandler";

// Import route modules
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import rfqRoutes from "./routes/rfqRoutes";
import jobRoutes from "./routes/jobRoutes";
import galleryRoutes from "./routes/galleryRoutes";
import adminRoutes from "./routes/adminRoutes";
import certificateRoutes from "./routes/certificateRoutes";
import partnerRoutes from "./routes/partnerRoutes";
import faqRoutes from "./routes/faqRoutes";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Security & utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allows frontend to load images from /uploads
    contentSecurityPolicy: false, // Prevents upgrade-insecure-requests from breaking HTTP localhost image loading
  })
);

app.use(
  cors({
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
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Static file hosting for uploaded water reports, resumes, and media
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
app.use("/uploads", express.static(uploadDir));

// Root service welcome
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    service: "R P Global Projects - Centralized REST API",
    version: "1.0.0",
    status: "online",
    documentation: "/api/v1/health",
  });
});

// Health check endpoint
app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      connected: isDBConnected(),
      provider: "MongoDB (Mongoose)",
    },
  });
});

// Guard middleware to prevent command buffering hangs when DB is unreachable
const requireDatabase = (_req: Request, res: Response, next: NextFunction) => {
  if (!isDBConnected()) {
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
app.use("/api/v1/auth", requireDatabase, authRoutes);
app.use("/api/v1/products", requireDatabase, productRoutes);
app.use("/api/v1/rfq", requireDatabase, rfqRoutes);
app.use("/api/v1/jobs", requireDatabase, jobRoutes);
app.use("/api/v1/gallery", requireDatabase, galleryRoutes);
app.use("/api/v1/admin", requireDatabase, adminRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/partners", partnerRoutes);
app.use("/api/v1/faqs", faqRoutes);

// 404 Route handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Requested API route does not exist.",
  });
});

// Global error handler
app.use(errorHandler);

// Start server and initialize database
const startServer = async () => {
  await connectDB();

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

export default app;
