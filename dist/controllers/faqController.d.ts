import { Request, Response } from "express";
/**
 * Public: GET /api/v1/faqs
 * Returns active FAQs sorted by order and creation date
 */
export declare const getFAQs: (req: Request, res: Response) => Promise<void>;
/**
 * Admin: GET /api/v1/faqs/admin
 * Returns all FAQs (including drafts/inactive) with metadata
 */
export declare const getAdminFAQs: (_req: Request, res: Response) => Promise<void>;
/**
 * Public/Admin: GET /api/v1/faqs/:id
 */
export declare const getFAQById: (req: Request, res: Response) => Promise<void>;
/**
 * Admin: POST /api/v1/faqs
 * Create a new FAQ item
 */
export declare const createFAQ: (req: Request, res: Response) => Promise<void>;
/**
 * Admin: PUT /api/v1/faqs/:id
 * Update an existing FAQ item
 */
export declare const updateFAQ: (req: Request, res: Response) => Promise<void>;
/**
 * Admin: DELETE /api/v1/faqs/:id
 * Delete an FAQ item
 */
export declare const deleteFAQ: (req: Request, res: Response) => Promise<void>;
/**
 * Admin: POST /api/v1/faqs/reorder
 * Batch update orders of FAQs
 */
export declare const reorderFAQs: (req: Request, res: Response) => Promise<void>;
