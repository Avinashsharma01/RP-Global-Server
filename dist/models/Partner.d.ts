import { Document, Model } from "mongoose";
export interface IPartner extends Document {
    name: string;
    logoUrl: string;
    category: string;
    website?: string;
    description?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Partner: Model<IPartner>;
