"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
// Public routes with brute-force rate limiter
router.post("/login", rateLimiter_1.authLimiter, authController_1.login);
router.post("/forgot-password", rateLimiter_1.authLimiter, authController_1.forgotPassword);
router.post("/reset-password/:token", rateLimiter_1.authLimiter, authController_1.resetPassword);
// Protected routes
router.get("/me", auth_1.authenticate, authController_1.getMe);
router.post("/change-password", auth_1.authenticate, authController_1.updatePassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map