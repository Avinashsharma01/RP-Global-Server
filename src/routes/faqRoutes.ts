import { Router } from "express";
import {
  getFAQs,
  getAdminFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  reorderFAQs,
} from "../controllers/faqController";
import { authenticate, requireRole } from "../middlewares/auth";

const router = Router();

// Public routes for landing page & public inspection
router.get("/", getFAQs);
router.get("/item/:id", getFAQById);

// Admin management routes (secured by JWT auth & roles)
router.get("/admin/all", authenticate, getAdminFAQs);
router.post("/reorder", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), reorderFAQs);
router.post("/", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), createFAQ);
router.put("/:id", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), updateFAQ);
router.delete("/:id", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), deleteFAQ);

export default router;
