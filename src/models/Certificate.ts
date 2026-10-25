import mongoose, { Document, Schema } from "mongoose";

export interface ICertificate extends Document {
  title: string;
  subtitle?: string;
  issuingAuthority: string;
  certificateNumber: string;
  category: "ISO" | "GOVERNMENT" | "LABOUR" | "CONTRACTOR" | "COMPLIANCE" | "OTHER";
  issueDate?: string;
  expiryDate?: string;
  imageUrl: string;
  pdfUrl?: string;
  verificationUrl?: string;
  description?: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Certificate title is required."],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    issuingAuthority: {
      type: String,
      required: [true, "Issuing authority is required."],
      trim: true,
    },
    certificateNumber: {
      type: String,
      required: [true, "Certificate registration number is required."],
      trim: true,
    },
    category: {
      type: String,
      enum: ["ISO", "GOVERNMENT", "LABOUR", "CONTRACTOR", "COMPLIANCE", "OTHER"],
      default: "COMPLIANCE",
    },
    issueDate: {
      type: String,
      default: "",
    },
    expiryDate: {
      type: String,
      default: "Permanent / Active",
    },
    imageUrl: {
      type: String,
      required: [true, "Certificate image or document path is required."],
      trim: true,
    },
    pdfUrl: {
      type: String,
      default: "",
    },
    verificationUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for rapid queries and ordered display
CertificateSchema.index({ order: 1, createdAt: -1 });
CertificateSchema.index({ isActive: 1, category: 1 });

export const Certificate = mongoose.model<ICertificate>(
  "Certificate",
  CertificateSchema
);
