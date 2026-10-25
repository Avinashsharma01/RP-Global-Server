"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.getMe = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const login = async (req, res) => {
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
        const user = await User_1.User.findOne({ email: email.toLowerCase().trim() }).select("+password");
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
        const jwtSecret = process.env.JWT_SECRET || "rpglobal_enterprise_secret_key_2026_industrial_clean_tech";
        const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: "7d" });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Authentication server error.",
            error: error.message,
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
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
exports.getMe = getMe;
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: "Current password and new password are both required.",
            });
            return;
        }
        const user = await User_1.User.findById(req.user?._id).select("+password");
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update password.",
            error: error.message,
        });
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=authController.js.map