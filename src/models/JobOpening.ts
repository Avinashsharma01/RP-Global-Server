import mongoose, { Document, Schema, Model } from "mongoose";

export interface IJobOpening extends Document {
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Contract" | "Part-time" | "Internship";
  experienceRequired: string;
  positionsOpen: number;
  responsibilities: string[];
  qualifications: string[];
  salaryRange?: string;
  isActive: boolean;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobOpeningSchema = new Schema<IJobOpening>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const JobOpening: Model<IJobOpening> =
  mongoose.models.JobOpening ||
  mongoose.model<IJobOpening>("JobOpening", jobOpeningSchema);
