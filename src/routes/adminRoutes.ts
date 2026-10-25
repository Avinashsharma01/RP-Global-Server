import { Router } from "express";
import { getAdminSummary } from "../controllers/adminController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Protected admin dashboard analytics
router.get("/summary", authenticate, getAdminSummary);

export default router;
