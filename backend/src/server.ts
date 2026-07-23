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

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
});
