"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.isDBConnected = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Disable command buffering so queries fail immediately when DB is disconnected
mongoose_1.default.set("bufferCommands", false);
mongoose_1.default.set("strictQuery", false);
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState === 1) {
        console.log("[MongoDB] Already connected to database.");
        return true;
    }
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rpglobal";
    try {
        // Event listeners
        mongoose_1.default.connection.on("connected", () => {
            console.log("[MongoDB] Database connection established successfully.");
        });
        mongoose_1.default.connection.on("error", (err) => {
            console.error("[MongoDB] Connection error:", err.message);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.warn("[MongoDB] Disconnected from database.");
        });
        await mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 3000,
        });
        console.log(`[MongoDB] Connected to database: ${mongoose_1.default.connection.name}`);
        return true;
    }
    catch (error) {
        console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${mongoURI}`);
        console.warn(`[MongoDB Warning] Details: ${error.message}`);
        console.warn("[MongoDB Notice] Ensure MongoDB is running locally (mongod) or provide a valid Atlas URI in server/.env");
        return false;
    }
};
exports.connectDB = connectDB;
const isDBConnected = () => mongoose_1.default.connection.readyState === 1;
exports.isDBConnected = isDBConnected;
const disconnectDB = async () => {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.disconnect();
        console.log("[MongoDB] Disconnected successfully.");
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=db.js.map