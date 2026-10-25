import { Document, Model } from "mongoose";
export type LeadStatus = "NEW" | "CONTACTED" | "TECHNICAL_EVALUATION" | "PROPOSAL_SENT" | "WON" | "LOST";
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
    source: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Lead: Model<ILead>;
