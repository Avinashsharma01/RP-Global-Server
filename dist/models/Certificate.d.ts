import mongoose, { Document } from "mongoose";
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
export declare const Certificate: mongoose.Model<ICertificate, {}, {}, {}, mongoose.Document<unknown, {}, ICertificate, {}, {}> & ICertificate & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
