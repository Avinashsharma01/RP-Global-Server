import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { LandingSection } from "../models/LandingSection";
import { isDBConnected } from "../config/db";
import {
  INITIAL_LANDING_CONTENT,
  LandingContentCollection,
} from "../data/initialLandingContent";

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
const jsonStorePath = path.join(uploadDir, "landing_sections_data.json");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function readLocalStore(): Record<string, any> {
  try {
    if (fs.existsSync(jsonStorePath)) {
      const raw = fs.readFileSync(jsonStorePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[LandingContent] Error reading local store:", err);
  }
  return {};
}

function writeLocalStore(data: Record<string, any>): void {
  try {
    fs.writeFileSync(jsonStorePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[LandingContent] Error writing local store:", err);
  }
}

/**
 * Get all landing page content sections, merged with robust defaults
 */
export const getAllLandingContent = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const localStore = readLocalStore();
    const result: Record<string, any> = { ...INITIAL_LANDING_CONTENT };

    if (isDBConnected()) {
      try {
        const sections = await LandingSection.find({});
        for (const sec of sections) {
          result[sec.sectionKey] = {
            ...result[sec.sectionKey],
            ...sec.data,
          };
        }
      } catch (dbErr: any) {
        console.warn("[MongoDB] Fallback to local store for landing content:", dbErr.message);
        for (const [key, val] of Object.entries(localStore)) {
          result[key] = {
            ...result[key],
            ...(val as Record<string, any>),
          };
        }
      }
    } else {
      for (const [key, val] of Object.entries(localStore)) {
        result[key] = {
          ...result[key],
          ...(val as Record<string, any>),
        };
      }
    }

    res.status(200).json({
      success: true,
      data: result as LandingContentCollection,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch landing content.",
      error: error.message,
    });
  }
};

/**
 * Get a specific landing section by key
 */
export const getLandingSection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sectionKey = String(req.params.sectionKey);
    const defaultData = (INITIAL_LANDING_CONTENT as any)[sectionKey];

    if (!defaultData && defaultData !== "") {
      res.status(404).json({
        success: false,
        message: `Landing section '${sectionKey}' is not recognized.`,
      });
      return;
    }

    let sectionData = defaultData;

    if (isDBConnected()) {
      try {
        const doc = await LandingSection.findOne({ sectionKey });
        if (doc) {
          sectionData = { ...defaultData, ...doc.data };
        }
      } catch (dbErr: any) {
        console.warn("[MongoDB] Landing section fallback:", dbErr.message);
        const localStore = readLocalStore();
        if (localStore[sectionKey]) {
          sectionData = { ...defaultData, ...localStore[sectionKey] };
        }
      }
    } else {
      const localStore = readLocalStore();
      if (localStore[sectionKey]) {
        sectionData = { ...defaultData, ...localStore[sectionKey] };
      }
    }

    res.status(200).json({
      success: true,
      sectionKey,
      data: sectionData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch landing section.",
      error: error.message,
    });
  }
};

/**
 * Update a specific landing section by key
 */
export const updateLandingSection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sectionKey = String(req.params.sectionKey);
    const incomingData = req.body;

    if (!incomingData || typeof incomingData !== "object") {
      res.status(400).json({
        success: false,
        message: "Section payload must be a valid JSON object.",
      });
      return;
    }

    const defaultData = (INITIAL_LANDING_CONTENT as any)[sectionKey] || {};
    const mergedData = { ...defaultData, ...incomingData };

    if (isDBConnected()) {
      try {
        await LandingSection.findOneAndUpdate(
          { sectionKey },
          { sectionKey, data: mergedData },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (dbErr: any) {
        console.warn("[MongoDB] Landing update error, saving to local store:", dbErr.message);
      }
    }

    // Mirror to local JSON store
    const localStore = readLocalStore();
    localStore[sectionKey] = mergedData;
    writeLocalStore(localStore);

    res.status(200).json({
      success: true,
      message: `Section '${sectionKey}' updated successfully.`,
      sectionKey,
      data: mergedData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update landing section.",
      error: error.message,
    });
  }
};

/**
 * Upload an image or video for landing sections directly to Cloudinary
 */
export const uploadLandingMedia = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let uploadedFile: Express.Multer.File | undefined;

    if (req.file) {
      uploadedFile = req.file;
    } else if (req.files) {
      if (Array.isArray(req.files) && req.files.length > 0) {
        uploadedFile = req.files[0];
      } else {
        const fileObj = req.files as { [fieldname: string]: Express.Multer.File[] };
        const found = fileObj.media || fileObj.image || fileObj.video || Object.values(fileObj)[0];
        if (found && found.length > 0) {
          uploadedFile = found[0];
        }
      }
    }

    if (!uploadedFile || !uploadedFile.path) {
      res.status(400).json({
        success: false,
        message: "No file was uploaded or upload failed. Allowed formats: JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, MOV.",
      });
      return;
    }

    const isVideo =
      uploadedFile.mimetype.startsWith("video/") ||
      /\.(mp4|webm|mov|mkv)$/i.test(uploadedFile.originalname);

    res.status(200).json({
      success: true,
      message: "File uploaded successfully to Cloudinary.",
      url: uploadedFile.path,
      data: {
        url: uploadedFile.path,
        publicId: uploadedFile.filename,
        resourceType: isVideo ? "video" : "image",
        format: uploadedFile.mimetype,
        message: "File uploaded successfully to Cloudinary.",
      },
      publicId: uploadedFile.filename,
      resourceType: isVideo ? "video" : "image",
      format: uploadedFile.mimetype,
      originalName: uploadedFile.originalname,
      size: uploadedFile.size,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to upload landing media.",
      error: error.message,
    });
  }
};
