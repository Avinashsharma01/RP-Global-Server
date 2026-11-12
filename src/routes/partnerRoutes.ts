import { Router } from "express";
import {
  getPartners,
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
  togglePartnerStatus,
} from "../controllers/partnerController";
import { uploadPartnerLogo } from "../middlewares/upload";
import { authenticate, requireRole } from "../middlewares/auth";

const router = Router();

// Public route: Landing page active partners
router.get("/", getPartners);

// Admin route: Get all partners (including inactive)
router.get("/all", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), getAllPartners);

// Get single partner
router.get("/:id", getPartnerById);

// Admin route: Create partner with logo upload
router.post("/", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), uploadPartnerLogo, createPartner);

// Admin route: Update partner
router.put("/:id", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), uploadPartnerLogo, updatePartner);

// Admin route: Toggle active status
router.patch("/:id/toggle", authenticate, requireRole("SUPER_ADMIN", "EDITOR"), togglePartnerStatus);

// Admin route: Delete partner
router.delete("/:id", authenticate, requireRole("SUPER_ADMIN"), deletePartner);

export default router;
