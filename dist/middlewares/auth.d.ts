import { Request, Response, NextFunction } from "express";
import { IUser, UserRole } from "../models/User";
export interface AuthenticatedRequest extends Request {
    user?: IUser;
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (...roles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
