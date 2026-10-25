import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { AuthenticatedRequest } from "../middlewares/auth";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are both required.",
      });
      return;
    }

    // Find user by email including hidden password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email credentials. Please verify your address.",
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: "This account has been deactivated. Contact super administrator.",
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid password provided. Please verify and retry.",
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Sign JWT
    const jwtSecret =
      process.env.JWT_SECRET || "rpglobal_enterprise_secret_key_2026_industrial_clean_tech";
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      jwtSecret as jwt.Secret,
      { expiresIn: "7d" }
    );

    // Return sanitized user object
    res.status(200).json({
      success: true,
      message: "Admin authentication successful.",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Authentication server error.",
      error: error.message,
    });
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthenticated" });
    return;
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
      role: req.user.role,
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt,
    },
  });
};

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Current password and new password are both required.",
      });
      return;
    }

    const user = await User.findById(req.user?._id).select("+password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Current password does not match.",
      });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update password.",
      error: error.message,
    });
  }
};
