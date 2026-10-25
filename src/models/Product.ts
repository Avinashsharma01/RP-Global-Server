import mongoose, { Document, Schema, Model } from "mongoose";

export type PlantCategory =
  | "DEMINERALIZATION_DM"
  | "EFFLUENT_TREATMENT_ETP"
  | "REVERSE_OSMOSIS_RO"
  | "SEWAGE_TREATMENT_STP"
  | "WATER_SOFTENING"
  | "WATER_TREATMENT_WTP";

export interface IProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  equipmentUsed?: string;
}

export interface ITechnicalSpec {
  label: string;
  value: string;
  unit?: string;
  category?: string; // e.g. "General", "Operating Limits", "MOC"
}

export interface IComparisonRow {
  parameter: string;
  techOptionA: string;
  techOptionB: string;
  techOptionC?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: PlantCategory;
  tagline: string;
  capacityRange: string;
  summary: string;
  description: string;
  keyFeatures: string[];
  processSteps: IProcessStep[];
  technicalSpecs: ITechnicalSpec[];
  comparisonMatrix: IComparisonRow[];
  applications: string[];
  imageUrl: string;
  brochureUrl?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);
