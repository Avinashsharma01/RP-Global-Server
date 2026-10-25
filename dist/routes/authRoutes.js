"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Public route
router.post("/login", authController_1.login);
// Protected routes
router.get("/me", auth_1.authenticate, authController_1.getMe);
router.post("/change-password", auth_1.authenticate, authController_1.updatePassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map