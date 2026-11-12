import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate, requireRole } from "../middlewares/auth";
import { uploadProductImage } from "../middlewares/upload";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin-only management routes with optional Cloudinary image upload
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  uploadProductImage,
  createProduct
);
router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  uploadProductImage,
  updateProduct
);
router.delete("/:id", authenticate, requireRole("SUPER_ADMIN"), deleteProduct);

export default router;
