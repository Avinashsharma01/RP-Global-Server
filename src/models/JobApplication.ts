import mongoose, { Document, Schema, Model } from "mongoose";

export type ApplicationStatus =
  | "SUBMITTED"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "OFFERED"
  | "REJECTED"
  | "HIRED";

export interface IJobApplication extends Document {
  jobOpeningId: mongoose.Types.ObjectId;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  currentCompany?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriodDays?: number;
  experienceYears?: string;
  resumeUrl: string;
  resumeFilename: string;
  coverNote?: string;
  status: ApplicationStatus;
  internalNotes: Array<{ text: string; author: string; createdAt: Date }>;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    jobOpeningId: {
      type: Schema.Types.ObjectId,
      ref: "JobOpening",
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Candidate full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Candidate email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Candidate phone is required"],
      trim: true,
    },
    currentCompany: {
      type: String,
      trim: true,
    },
    currentCtc: {
      type: String,
      trim: true,
    },
    expectedCtc: {
      type: String,
      trim: true,
    },
    noticePeriodDays: {
      type: Number,
      default: 30,
    },
    experienceYears: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume document is required"],
    },
    resumeFilename: {
      type: String,
      required: true,
    },
    coverNote: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "SUBMITTED",
        "SHORTLISTED",
        "INTERVIEW_SCHEDULED",
        "OFFERED",
        "REJECTED",
        "HIRED",
      ],
      default: "SUBMITTED",
    },
    internalNotes: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const JobApplication: Model<IJobApplication> =
  mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", jobApplicationSchema);
