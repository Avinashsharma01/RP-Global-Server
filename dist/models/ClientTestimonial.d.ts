import { Document, Model } from "mongoose";
export interface IClientTestimonial extends Document {
    clientName: string;
    designation: string;
    company: string;
    feedback: string;
    rating: number;
    plantInstalled: string;
    isApproved: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ClientTestimonial: Model<IClientTestimonial>;
