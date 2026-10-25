import mongoose from "mongoose";

// Disable command buffering so queries fail immediately when DB is disconnected
mongoose.set("bufferCommands", false);
mongoose.set("strictQuery", false);

export const connectDB = async (): Promise<boolean> => {
  if (mongoose.connection.readyState === 1) {
    console.log("[MongoDB] Already connected to database.");
    return true;
  }

  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rpglobal";

  try {
    // Event listeners
    mongoose.connection.on("connected", () => {
      console.log("[MongoDB] Database connection established successfully.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("[MongoDB] Connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("[MongoDB] Disconnected from database.");
    });

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log(`[MongoDB] Connected to database: ${mongoose.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoURI}`);
    console.warn(`[MongoDB Warning] Details: ${error.message}`);
    console.warn(
      "[MongoDB Notice] Ensure MongoDB is running locally (mongod) or provide a valid Atlas URI in server/.env"
    );
    return false;
  }
};

export const isDBConnected = (): boolean => mongoose.connection.readyState === 1;

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("[MongoDB] Disconnected successfully.");
  }
};
