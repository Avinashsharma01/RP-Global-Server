import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate, requireRole } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Admin-only management routes
router.post("/", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), createProduct);
router.put("/:id", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), updateProduct);
router.delete("/:id", authenticate, requireRole("SUPER_ADMIN"), deleteProduct);

export default router;
