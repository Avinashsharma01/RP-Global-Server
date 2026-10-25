import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
export declare const submitRFQ: (req: Request, res: Response) => Promise<void>;
export declare const getLeads: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getLeadById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateLeadStatus: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const addLeadNote: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteLead: (req: AuthenticatedRequest, res: Response) => Promise<void>;
