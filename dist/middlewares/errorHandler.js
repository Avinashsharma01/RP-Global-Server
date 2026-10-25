"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const errorHandler = (err, _req, res, _next) => {
    console.error("[API Error Handler]", err);
    // Multer errors
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({
                success: false,
                message: "Uploaded file is too large. Maximum permitted file size is 10MB.",
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: `File upload error: ${err.message}`,
        });
        return;
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: messages,
        });
        return;
    }
    // Mongoose CastError (Invalid ObjectId)
    if (err.name === "CastError") {
        res.status(400).json({
            success: false,
            message: `Resource not found with invalid identifier: ${err.value}`,
        });
        return;
    }
    // MongoDB duplicate key error (code 11000)
    if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue || {})[0] || "field";
        res.status(409).json({
            success: false,
            message: `Duplicate entry error: A record with that ${duplicateField} already exists.`,
        });
        return;
    }
    // Custom or default 500 error
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map