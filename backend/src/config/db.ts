import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async (mongoUri: string): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error({ err }, "MongoDB connection failed");
    throw err;
  }
};

export default connectDB;
