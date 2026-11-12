import mongoose, { Document, Schema, Model } from "mongoose";

export interface ILandingSection extends Document {
  sectionKey: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const landingSectionSchema = new Schema<ILandingSection>(
  {
    sectionKey: {
      type: String,
      required: [true, "Section key is required"],
      unique: true,
      trim: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: [true, "Section data is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const LandingSection: Model<ILandingSection> = mongoose.model<ILandingSection>(
  "LandingSection",
  landingSectionSchema
);
