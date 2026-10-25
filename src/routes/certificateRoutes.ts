import { Router } from "express";
import {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controllers/certificateController";
import { authenticate, requireRole } from "../middlewares/auth";
import { uploadCertificateFile } from "../middlewares/upload";

const router = Router();

// Public: View all active certificates
router.get("/", getCertificates);
router.get("/:id", getCertificateById);

// Admin: Upload and manage certificates
router.post(
  "/",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  uploadCertificateFile,
  createCertificate
);

router.put(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN", "EDITOR"),
  uploadCertificateFile,
  updateCertificate
);

router.delete(
  "/:id",
  authenticate,
  requireRole("SUPER_ADMIN"),
  deleteCertificate
);

export default router;
