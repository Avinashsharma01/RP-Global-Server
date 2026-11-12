import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const isConfigured = Object.values(cloudinaryConfig).every(Boolean);

if (isConfigured) {
  cloudinary.config(cloudinaryConfig);
}

const uploadBuffer = (
  buffer: Buffer,
  originalName: string,
  folder = process.env.CLOUDINARY_FOLDER || "rp-global"
): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    if (!isConfigured) {
      reject(
        new Error(
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
        )
      );
      return;
    }

    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        filename_override: originalName,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary did not return an upload result."));
          return;
        }
        resolve(result);
      }
    );

    upload.end(buffer);
  });

const checkCloudinaryConnection = async (): Promise<{
  configured: boolean;
  connected: boolean;
  error?: string;
}> => {
  if (!isConfigured) {
    return { configured: false, connected: false };
  }

  try {
    await cloudinary.api.ping();
    return { configured: true, connected: true };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      error: error instanceof Error ? error.message : "Unknown Cloudinary connection error.",
    };
  }
};

export { checkCloudinaryConnection, uploadBuffer };
