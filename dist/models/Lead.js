"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const leadSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
    },
    companyName: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    plantCategory: {
        type: String,
        required: [true, "Plant category is required"],
        trim: true,
    },
    requiredCapacityKLD: {
        type: String,
        trim: true,
    },
    rawWaterSource: {
        type: String,
        trim: true,
    },
    inletParameters: {
        pH: String,
        TDS: String,
        COD: String,
        BOD: String,
        TSS: String,
        oilGrease: String,
    },
    projectLocation: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        trim: true,
    },
    attachedReportUrl: {
        type: String,
    },
    attachedReportFilename: {
        type: String,
    },
    status: {
        type: String,
        enum: [
            "NEW",
            "CONTACTED",
            "TECHNICAL_EVALUATION",
            "PROPOSAL_SENT",
            "WON",
            "LOST",
        ],
        default: "NEW",
    },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        default: "MEDIUM",
    },
    internalNotes: [
        {
            text: { type: String, required: true },
            author: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    estimatedValueINR: {
        type: Number,
    },
    source: {
        type: String,
        default: "Website RFQ Portal",
    },
}, {
    timestamps: true,
});
exports.Lead = mongoose_1.default.models.Lead || mongoose_1.default.model("Lead", leadSchema);
//# sourceMappingURL=Lead.js.map