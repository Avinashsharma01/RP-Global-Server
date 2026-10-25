import { Document, Model } from "mongoose";
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
export declare const ProjectGallery: Model<IProjectGallery>;
