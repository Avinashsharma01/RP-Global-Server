import { Router } from "express";
import {
  getAllLandingContent,
  getLandingSection,
  updateLandingSection,
  uploadLandingMedia,
} from "../controllers/landingController";
import { authenticate, requireRole } from "../middlewares/auth";
import { uploadLandingMediaFile } from "../middlewares/upload";

const router = Router();

// Public routes for landing page consumption
router.get("/", getAllLandingContent);
router.get("/:sectionKey", getLandingSection);

// Admin-only management routes
router.put(
  "/:sectionKey",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  updateLandingSection
);

// Cloudinary upload endpoint for landing images and videos
router.post(
  "/upload",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  uploadLandingMediaFile,
  uploadLandingMedia
);

export default router;
