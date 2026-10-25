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
exports.ProjectGallery = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const projectGallerySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Project title is required"],
        trim: true,
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
    },
    capacityKLD: {
        type: String,
        required: [true, "Capacity is required"],
        trim: true,
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true,
    },
    clientSector: {
        type: String,
        required: [true, "Client sector is required"],
        trim: true,
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"],
    },
    images: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ["RUNNING", "COMPLETED"],
        default: "COMPLETED",
        index: true,
    },
    progressPercentage: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
    },
    currentStage: {
        type: String,
        default: "Commissioned & Handed Over",
        trim: true,
    },
    expectedCompletion: {
        type: String,
        default: "",
        trim: true,
    },
    keyHighlights: {
        type: [String],
        default: [],
    },
    completionYear: {
        type: Number,
        default: 2024,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
exports.ProjectGallery = mongoose_1.default.models.ProjectGallery ||
    mongoose_1.default.model("ProjectGallery", projectGallerySchema);
//# sourceMappingURL=ProjectGallery.js.map