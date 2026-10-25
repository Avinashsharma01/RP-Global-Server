import mongoose, { Document, Schema, Model } from "mongoose";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "TECHNICAL_EVALUATION"
  | "PROPOSAL_SENT"
  | "WON"
  | "LOST";

export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface IInternalNote {
  text: string;
  author: string;
  createdAt: Date;
}

export interface IInletParameters {
  pH?: string;
  TDS?: string;
  COD?: string;
  BOD?: string;
  TSS?: string;
  oilGrease?: string;
}

export interface ILead extends Document {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  plantCategory: string;
  requiredCapacityKLD?: string;
  rawWaterSource?: string;
  inletParameters?: IInletParameters;
  projectLocation?: string;
  message?: string;
  attachedReportUrl?: string;
  attachedReportFilename?: string;
  status: LeadStatus;
  priority: LeadPriority;
  internalNotes: IInternalNote[];
  estimatedValueINR?: number;
  source: string; // e.g. "Homepage Calculator", "Contact Form", "Solution Page RFQ"
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", leadSchema);
