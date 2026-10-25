import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPartner extends Document {
  name: string;
  logoUrl: string;
  category: string;
  website?: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new Schema<IPartner>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: "Industrial Client",
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

partnerSchema.index({ order: 1, createdAt: -1 });
partnerSchema.index({ isActive: 1 });

export const Partner: Model<IPartner> =
  mongoose.models.Partner || mongoose.model<IPartner>("Partner", partnerSchema);
