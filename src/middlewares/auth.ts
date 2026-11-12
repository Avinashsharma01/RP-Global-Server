import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser, UserRole } from "../models/User";
import { isDBConnected } from "../config/db";

// Extend Express Request type
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token missing or invalid format. Please login.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const jwtSecret =
      process.env.JWT_SECRET || "rpglobal_enterprise_secret_key_2026_industrial_clean_tech";

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!isDBConnected()) {
      res.status(503).json({
        success: false,
        message: "Authentication service is temporarily unavailable.",
        code: "DATABASE_UNAVAILABLE",
      });
      return;
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User account associated with this token no longer exists.",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "Your admin account has been deactivated. Please contact administrator.",
      });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthenticated request.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' lacks permission for this action.`,
      });
      return;
    }

    next();
  };
};
