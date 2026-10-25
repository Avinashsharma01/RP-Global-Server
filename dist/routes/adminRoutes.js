"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Protected admin dashboard analytics
router.get("/summary", auth_1.authenticate, adminController_1.getAdminSummary);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map