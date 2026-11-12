import path from "path";
import fs from "fs";
import net from "net";
import { MongoMemoryServer } from "mongodb-memory-server";

let localMongoInstance: MongoMemoryServer | null = null;

/**
 * Checks if a TCP port is currently open and accepting connections
 */
export const isPortOpen = (port: number, host = "127.0.0.1", timeout = 1000): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;
    socket.setTimeout(timeout);
    socket.once("connect", () => {
      status = true;
      socket.end();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
};

/**
 * Starts a persistent embedded MongoDB server if port 27017 is not already active
 */
export const ensureLocalMongo = async (port = 27017): Promise<string> => {
  // Check if port is already active (e.g. system mongod or existing server)
  const active = await isPortOpen(port);
  if (active) {
    console.log(`[Local MongoDB] Detected active MongoDB service on port ${port}. Connecting...`);
    return `mongodb://127.0.0.1:${port}/rpglobal`;
  }

  if (localMongoInstance) {
    return localMongoInstance.getUri();
  }

  const dbPath = path.resolve(process.cwd(), "data/db");
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  console.log(`[Local MongoDB] Initializing persistent WiredTiger MongoDB on port ${port}...`);
  console.log(`[Local MongoDB] Storage directory: ${dbPath}`);

  try {
    localMongoInstance = await MongoMemoryServer.create({
      instance: {
        port,
        dbPath,
        storageEngine: "wiredTiger",
        dbName: "rpglobal",
      },
    });

    const uri = localMongoInstance.getUri();
    console.log(`[Local MongoDB] Embedded MongoDB ready: ${uri}`);
    return uri;
  } catch (error: any) {
    // If another thread or process took the port in the meantime
    if (error.message && error.message.includes("EADDRINUSE")) {
      console.log(`[Local MongoDB] Port ${port} is in use. Connecting to existing instance.`);
      return `mongodb://127.0.0.1:${port}/rpglobal`;
    }
    console.error("[Local MongoDB] Failed to initialize embedded MongoDB:", error.message);
    throw error;
  }
};

/**
 * Gracefully stop the embedded MongoDB instance
 */
export const stopLocalMongo = async (): Promise<void> => {
  if (localMongoInstance) {
    console.log("[Local MongoDB] Stopping embedded MongoDB instance...");
    await localMongoInstance.stop();
    localMongoInstance = null;
    console.log("[Local MongoDB] Embedded MongoDB stopped.");
  }
};

