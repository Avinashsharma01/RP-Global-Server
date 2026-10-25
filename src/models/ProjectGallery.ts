import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProjectGallery extends Document {
  title: string;
  category: string;
  capacityKLD: string;
  location: string;
  clientSector: string;
  imageUrl: string;
  images?: string[];
  status: "RUNNING" | "COMPLETED";
  progressPercentage?: number;
  currentStage?: string;
  expectedCompletion?: string;
  keyHighlights?: string[];
  completionYear?: number;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectGallerySchema = new Schema<IProjectGallery>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const ProjectGallery: Model<IProjectGallery> =
  mongoose.models.ProjectGallery ||
  mongoose.model<IProjectGallery>("ProjectGallery", projectGallerySchema);
