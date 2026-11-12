"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const app_1 = require("./app");
const db_1 = require("./config/db");
const cloudinary_1 = require("./config/cloudinary");
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const uploadDir = path_1.default.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
// Start server and initialize database
const startServer = async () => {
    await (0, db_1.connectDB)();
    const cloudinaryStatus = await (0, cloudinary_1.checkCloudinaryConnection)();
    const serverInstance = app_1.app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(`  R P GLOBAL PROJECTS — REST API SERVER             `);
        console.log(`  Listening on: http://localhost:${PORT}             `);
        console.log(`  Allowed Client: ${CLIENT_URL}                     `);
        console.log(`  Local Uploads Directory: ${uploadDir}             `);
        if (cloudinaryStatus.connected) {
            console.log(`  Cloudinary: CONNECTED                            `);
        }
        else if (!cloudinaryStatus.configured) {
            console.log(`  Cloudinary: NOT CONFIGURED                       `);
        }
        else {
            console.log(`  Cloudinary: CONNECTION FAILED                   `);
            console.error(`  Cloudinary error: ${cloudinaryStatus.error}`);
        }
        console.log(`====================================================`);
    });
    const gracefulShutdown = async (signal) => {
        console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
        serverInstance.close(async () => {
            await (0, db_1.disconnectDB)();
            process.exit(0);
        });
    };
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};
startServer();
//# sourceMappingURL=index.js.map