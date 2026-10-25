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
exports.JobApplication = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const jobApplicationSchema = new mongoose_1.Schema({
    jobOpeningId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "JobOpening",
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: [true, "Candidate full name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Candidate email is required"],
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Candidate phone is required"],
        trim: true,
    },
    currentCompany: {
        type: String,
        trim: true,
    },
    currentCtc: {
        type: String,
        trim: true,
    },
    expectedCtc: {
        type: String,
        trim: true,
    },
    noticePeriodDays: {
        type: Number,
        default: 30,
    },
    experienceYears: {
        type: String,
        trim: true,
    },
    resumeUrl: {
        type: String,
        required: [true, "Resume document is required"],
    },
    resumeFilename: {
        type: String,
        required: true,
    },
    coverNote: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: [
            "SUBMITTED",
            "SHORTLISTED",
            "INTERVIEW_SCHEDULED",
            "OFFERED",
            "REJECTED",
            "HIRED",
        ],
        default: "SUBMITTED",
    },
    internalNotes: [
        {
            text: { type: String, required: true },
            author: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, {
    timestamps: true,
});
exports.JobApplication = mongoose_1.default.models.JobApplication ||
    mongoose_1.default.model("JobApplication", jobApplicationSchema);
//# sourceMappingURL=JobApplication.js.map