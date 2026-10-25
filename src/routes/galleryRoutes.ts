import { Router } from "express";
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadProjectImages,
  deleteProjectImage,
} from "../controllers/galleryController";
import { authenticate, requireRole } from "../middlewares/auth";
import { uploadProjectImage, uploadProjectGalleryImages } from "../middlewares/upload";

const router = Router();

// Public gallery view
router.get("/", getGallery);

// Admin-only management
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  uploadProjectImage,
  createGalleryItem
);

router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  uploadProjectImage,
  updateGalleryItem
);

// Upload multiple images to a specific project
router.post(
  "/:id/images",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  uploadProjectGalleryImages,
  uploadProjectImages
);

// Delete an image from a project's gallery
router.delete(
  "/:id/images",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  deleteProjectImage
);

router.delete("/:id", authenticate, requireRole("SUPER_ADMIN"), deleteGalleryItem);

export default router;
