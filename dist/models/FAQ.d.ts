import mongoose, { Document } from "mongoose";
export interface IFAQ extends Document {
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const FAQ: mongoose.Model<IFAQ, {}, {}, {}, mongoose.Document<unknown, {}, IFAQ, {}, {}> & IFAQ & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
