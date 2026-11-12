import path from "path";
import "dotenv/config";
import { app } from "./app";
import { connectDB, disconnectDB } from "./config/db";
import { checkCloudinaryConnection } from "./config/cloudinary";

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");

// Start server and initialize database
const startServer = async () => {
  await connectDB();
  const cloudinaryStatus = await checkCloudinaryConnection();

  const serverInstance = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  R P GLOBAL PROJECTS — REST API SERVER             `);
    console.log(`  Listening on: http://localhost:${PORT}             `);
    console.log(`  Allowed Client: ${CLIENT_URL}                     `);
    console.log(`  Local Uploads Directory: ${uploadDir}             `);
    if (cloudinaryStatus.connected) {
      console.log(`  Cloudinary: CONNECTED                            `);
    } else if (!cloudinaryStatus.configured) {
      console.log(`  Cloudinary: NOT CONFIGURED                       `);
    } else {
      console.log(`  Cloudinary: CONNECTION FAILED                   `);
      console.error(`  Cloudinary error: ${cloudinaryStatus.error}`);
    }
    console.log(`====================================================`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    serverInstance.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

startServer();
