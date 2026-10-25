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
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    category: {
        type: String,
        required: [true, "Plant category is required"],
        enum: [
            "DEMINERALIZATION_DM",
            "EFFLUENT_TREATMENT_ETP",
            "REVERSE_OSMOSIS_RO",
            "SEWAGE_TREATMENT_STP",
            "WATER_SOFTENING",
            "WATER_TREATMENT_WTP",
        ],
    },
    tagline: {
        type: String,
        required: true,
    },
    capacityRange: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    keyFeatures: {
        type: [String],
        default: [],
    },
    processSteps: [
        {
            stepNumber: { type: Number, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            equipmentUsed: { type: String },
        },
    ],
    technicalSpecs: [
        {
            label: { type: String, required: true },
            value: { type: String, required: true },
            unit: { type: String },
            category: { type: String, default: "General" },
        },
    ],
    comparisonMatrix: [
        {
            parameter: { type: String, required: true },
            techOptionA: { type: String, required: true },
            techOptionB: { type: String, required: true },
            techOptionC: { type: String },
        },
    ],
    applications: {
        type: [String],
        default: [],
    },
    imageUrl: {
        type: String,
        default: "/images/plants/default-plant.jpg",
    },
    brochureUrl: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
exports.Product = mongoose_1.default.models.Product || mongoose_1.default.model("Product", productSchema);
//# sourceMappingURL=Product.js.map