import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
export declare const getAdminSummary: (_req: AuthenticatedRequest, res: Response) => Promise<void>;
