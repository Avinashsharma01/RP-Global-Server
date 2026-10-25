import { Router } from "express";
import { login, getMe, updatePassword } from "../controllers/authController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Public route
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getMe);
router.post("/change-password", authenticate, updatePassword);

export default router;
