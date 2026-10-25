"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faqController_1 = require("../controllers/faqController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Public routes for landing page & public inspection
router.get("/", faqController_1.getFAQs);
router.get("/item/:id", faqController_1.getFAQById);
// Admin management routes (secured by JWT auth & roles)
router.get("/admin/all", auth_1.authenticate, faqController_1.getAdminFAQs);
router.post("/reorder", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), faqController_1.reorderFAQs);
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), faqController_1.createFAQ);
router.put("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), faqController_1.updateFAQ);
router.delete("/:id", auth_1.authenticate, (0, auth_1.requireRole)("SUPER_ADMIN", "EDITOR"), faqController_1.deleteFAQ);
exports.default = router;
//# sourceMappingURL=faqRoutes.js.map