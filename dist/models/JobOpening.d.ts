import { Document, Model } from "mongoose";
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
export declare const JobOpening: Model<IJobOpening>;
