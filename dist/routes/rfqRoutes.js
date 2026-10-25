"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfqController_1 = require("../controllers/rfqController");
const auth_1 = require("../middlewares/auth");
const upload_1 = require("../middlewares/upload");
const router = (0, express_1.Router)();
// Public RFQ submission with optional water test report attachment
router.post("/", upload_1.uploadReport, rfqController_1.submitRFQ);
// Protected Admin CRM routes
router.get("/", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER"), rfqController_1.getLeads);
router.get("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER"), rfqController_1.getLeadById);
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER"), rfqController_1.updateLeadStatus);
router.post("/:id/notes", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "SALES_MANAGER"), rfqController_1.addLeadNote);
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN"), rfqController_1.deleteLead);
exports.default = router;
//# sourceMappingURL=rfqRoutes.js.map