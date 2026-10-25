import { Document, Model } from "mongoose";
export type PlantCategory = "DEMINERALIZATION_DM" | "EFFLUENT_TREATMENT_ETP" | "REVERSE_OSMOSIS_RO" | "SEWAGE_TREATMENT_STP" | "WATER_SOFTENING" | "WATER_TREATMENT_WTP";
export interface IProcessStep {
    stepNumber: number;
    title: string;
    description: string;
    equipmentUsed?: string;
}
export interface ITechnicalSpec {
    label: string;
    value: string;
    unit?: string;
    category?: string;
}
export interface IComparisonRow {
    parameter: string;
    techOptionA: string;
    techOptionB: string;
    techOptionC?: string;
}
export interface IProduct extends Document {
    name: string;
    slug: string;
    category: PlantCategory;
    tagline: string;
    capacityRange: string;
    summary: string;
    description: string;
    keyFeatures: string[];
    processSteps: IProcessStep[];
    technicalSpecs: ITechnicalSpec[];
    comparisonMatrix: IComparisonRow[];
    applications: string[];
    imageUrl: string;
    brochureUrl?: string;
    order: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Product: Model<IProduct>;
