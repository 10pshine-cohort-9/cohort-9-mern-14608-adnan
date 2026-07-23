import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./config/logger.js";

const rawPort = process.env.PORT || "5000";
const PORT = Number(rawPort);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  logger.error(`Invalid PORT value: ${rawPort}`);
  process.exit(1);
}

const start = async (): Promise<void> => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
    server.on("error", (err) => {
      logger.error({ err }, "Server failed to start");
      process.exit(1);
    });
  } catch (err) {
    logger.error({ err }, "Startup failed");
    process.exit(1);
  }
};

start();
