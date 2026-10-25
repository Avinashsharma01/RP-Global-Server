import { Document, Model } from "mongoose";
export type UserRole = "SUPER_ADMIN" | "SALES_MANAGER" | "HR_MANAGER" | "EDITOR";
export interface IUser extends Document {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: Model<IUser>;
