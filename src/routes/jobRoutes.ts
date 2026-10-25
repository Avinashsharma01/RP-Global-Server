import { Router } from "express";
import {
  getJobs,
  getJobBySlugOrId,
  applyForJob,
  createJob,
  updateJob,
  deleteJob,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/jobController";
import { authenticate, requireRole } from "../middlewares/auth";
import { uploadResume } from "../middlewares/upload";

const router = Router();

// Public routes
router.get("/", getJobs);
router.get("/:identifier", getJobBySlugOrId);
router.post("/:id/apply", uploadResume, applyForJob);

// Admin recruitment ATS routes
router.post("/", authenticate, requireRole("SUPER_ADMIN", "HR_MANAGER"), createJob);
router.put("/:id", authenticate, requireRole("SUPER_ADMIN", "HR_MANAGER"), updateJob);
router.delete("/:id", authenticate, requireRole("SUPER_ADMIN"), deleteJob);

// Applications review routes
router.get(
  "/admin/applications",
  authenticate,
  requireRole("SUPER_ADMIN", "HR_MANAGER"),
  getJobApplications
);
router.patch(
  "/admin/applications/:id/status",
  authenticate,
  requireRole("SUPER_ADMIN", "HR_MANAGER"),
  updateApplicationStatus
);

export default router;
