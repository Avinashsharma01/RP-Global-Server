import mongoose, { Document, Model } from "mongoose";
export type ApplicationStatus = "SUBMITTED" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "OFFERED" | "REJECTED" | "HIRED";
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
    internalNotes: Array<{
        text: string;
        author: string;
        createdAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const JobApplication: Model<IJobApplication>;
