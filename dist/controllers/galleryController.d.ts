import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
export declare const getGallery: (req: Request, res: Response) => Promise<void>;
export declare const createGalleryItem: (req: Request, res: Response) => Promise<void>;
export declare const updateGalleryItem: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteGalleryItem: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const uploadProjectImages: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteProjectImage: (req: AuthenticatedRequest, res: Response) => Promise<void>;
