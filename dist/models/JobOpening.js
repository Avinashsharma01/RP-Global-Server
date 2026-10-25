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
exports.JobOpening = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const jobOpeningSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    department: {
        type: String,
        required: [true, "Department is required"],
        trim: true,
    },
    location: {
        type: String,
        required: [true, "Job location is required"],
        trim: true,
    },
    employmentType: {
        type: String,
        enum: ["Full-time", "Contract", "Part-time", "Internship"],
        default: "Full-time",
    },
    experienceRequired: {
        type: String,
        required: true,
    },
    positionsOpen: {
        type: Number,
        default: 1,
    },
    responsibilities: {
        type: [String],
        default: [],
    },
    qualifications: {
        type: [String],
        default: [],
    },
    salaryRange: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    deadline: {
        type: Date,
    },
}, {
    timestamps: true,
});
exports.JobOpening = mongoose_1.default.models.JobOpening ||
    mongoose_1.default.model("JobOpening", jobOpeningSchema);
//# sourceMappingURL=JobOpening.js.map