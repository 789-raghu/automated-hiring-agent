import mongoose from "mongoose";
import logger from "./logger";

const DBConnect = async (): Promise<void> => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("MONGODB_URI is not defined");
        }
        const conn = await mongoose.connect(uri);
        logger.info(`MongoDB connected: ${conn.connection.host}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error(`MongoDB connection error: ${error.message}`);
        } else {
            logger.error("Unknown MongoDB connection error");
        }

        process.exit(1);
    }
};

export default DBConnect;