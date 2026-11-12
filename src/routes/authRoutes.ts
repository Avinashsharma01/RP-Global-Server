import { Router } from "express";
import {
  login,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { authenticate } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rateLimiter";

const router = Router();

// Public routes with brute-force rate limiter
router.post("/login", authLimiter, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);

// Protected routes
router.get("/me", authenticate, getMe);
router.post("/change-password", authenticate, updatePassword);

export default router;
