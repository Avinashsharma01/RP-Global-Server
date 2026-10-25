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

const router = Router();

// Public route: Landing page active partners
router.get("/", getPartners);

// Admin route: Get all partners (including inactive)
router.get("/all", getAllPartners);

// Get single partner
router.get("/:id", getPartnerById);

// Admin route: Create partner with logo upload
router.post("/", uploadPartnerLogo, createPartner);

// Admin route: Update partner
router.put("/:id", uploadPartnerLogo, updatePartner);

// Admin route: Toggle active status
router.patch("/:id/toggle", togglePartnerStatus);

// Admin route: Delete partner
router.delete("/:id", deletePartner);

export default router;
