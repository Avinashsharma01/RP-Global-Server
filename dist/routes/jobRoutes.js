"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
// Public routes
router.get("/", jobController_1.getJobs);
router.get("/:identifier", jobController_1.getJobBySlugOrId);
router.post("/:id/apply", upload_1.uploadResume, jobController_1.applyForJob);
// Admin recruitment ATS routes
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "HR_MANAGER"), jobController_1.createJob);
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "HR_MANAGER"), jobController_1.updateJob);
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN"), jobController_1.deleteJob);
// Applications review routes
router.get("/admin/applications", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "HR_MANAGER"), jobController_1.getJobApplications);
router.patch("/admin/applications/:id/status", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "HR_MANAGER"), jobController_1.updateApplicationStatus);
exports.default = router;
//# sourceMappingURL=jobRoutes.js.map