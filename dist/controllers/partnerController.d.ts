import { Request, Response } from "express";
export declare const DEFAULT_PARTNERS: {
    _id: string;
    name: string;
    category: string;
    logoUrl: string;
    website: string;
    description: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}[];
/**
 * Public: Get active partners for landing page
 */
export declare const getPartners: (req: Request, res: Response) => Promise<void>;
/**
 * Admin: Get all partners (including inactive)
 */
export declare const getAllPartners: (_req: Request, res: Response) => Promise<void>;
/**
 * Get single partner by ID
 */
export declare const getPartnerById: (req: Request, res: Response) => Promise<void>;
/**
 * Create new partner (supports uploaded file or URL)
 */
export declare const createPartner: (req: Request, res: Response) => Promise<void>;
/**
 * Update partner (supports replacing logo with new upload or URL)
 */
export declare const updatePartner: (req: Request, res: Response) => Promise<void>;
/**
 * Delete partner
 */
export declare const deletePartner: (req: Request, res: Response) => Promise<void>;
/**
 * Toggle active status
 */
export declare const togglePartnerStatus: (req: Request, res: Response) => Promise<void>;
