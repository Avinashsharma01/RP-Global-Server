import { Router } from "express";
import {
  submitRFQ,
  getLeads,
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  deleteLead,
} from "../controllers/rfqController";
import { authenticate, requireRole } from "../middlewares/auth";
import { uploadReport } from "../middlewares/upload";

const router = Router();

// Public RFQ submission with optional water test report attachment
router.post("/", uploadReport, submitRFQ);

// Protected Admin CRM routes
router.get("/", authenticate, requireRole("SUPER_ADMIN", "SALES_MANAGER"), getLeads);
router.get("/:id", authenticate, requireRole("SUPER_ADMIN", "SALES_MANAGER"), getLeadById);
router.patch(
  "/:id/status",
  authenticate,
  requireRole("SUPER_ADMIN", "SALES_MANAGER"),
  updateLeadStatus
);
router.post(
  "/:id/notes",
  authenticate,
  requireRole("SUPER_ADMIN", "SALES_MANAGER"),
  addLeadNote
);
router.delete("/:id", authenticate, requireRole("SUPER_ADMIN"), deleteLead);

export default router;
