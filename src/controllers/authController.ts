import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, IUser } from "../models/User";
import { AuthenticatedRequest } from "../middlewares/auth";
import { emailService } from "../services/emailService";

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

/**
 * Request password reset link (public)
 */
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required to request a password reset.",
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return 200 with generic success to prevent email enumeration
      res.status(200).json({
        success: true,
        message:
          "If an administrator account with that email exists, a password reset link has been dispatched.",
      });
      return;
    }

    // Get reset token and save
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Reset URL
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetUrl = `${clientUrl}/admin/reset-password/${resetToken}`;

    // Send email asynchronously
    void emailService.sendPasswordResetEmail(user.email, resetUrl, user.fullName);

    res.status(200).json({
      success: true,
      message:
        "If an administrator account with that email exists, a password reset link has been dispatched.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Could not process password reset request.",
      error: error.message,
    });
  }
};

/**
 * Reset password with valid token (public)
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
      return;
    }

    const rawToken = Array.isArray(token) ? token[0] : token;
    if (!rawToken) {
      res.status(400).json({
        success: false,
        message: "Invalid reset token provided.",
      });
      return;
    }

    // Hash the token from url params to compare with database
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select("+password");

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Password reset link is invalid or has expired.",
      });
      return;
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been successfully updated. You may now log in.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Could not reset password.",
      error: error.message,
    });
  }
};
