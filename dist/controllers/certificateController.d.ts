import { Request, Response } from "express";
import { ICertificate } from "../models/Certificate";
import { AuthenticatedRequest } from "../middlewares/auth";
export declare const DEFAULT_CERTIFICATES: Array<Partial<ICertificate>>;
/**
 * Public & Admin: Fetch all certificates
 */
export declare const getCertificates: (req: Request, res: Response) => Promise<void>;
/**
 * Public: Fetch single certificate by ID
 */
export declare const getCertificateById: (req: Request, res: Response) => Promise<void>;
/**
 * Admin: Create a new certificate
 */
export declare const createCertificate: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Admin: Update existing certificate
 */
export declare const updateCertificate: (req: AuthenticatedRequest, res: Response) => Promise<void>;
/**
 * Admin: Delete certificate
 */
export declare const deleteCertificate: (req: AuthenticatedRequest, res: Response) => Promise<void>;
