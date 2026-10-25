export interface DefaultFAQItem {
    _id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isActive: boolean;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}
export declare const INITIAL_FAQS: DefaultFAQItem[];
