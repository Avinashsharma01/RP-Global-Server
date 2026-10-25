import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getMe: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updatePassword: (req: AuthenticatedRequest, res: Response) => Promise<void>;
