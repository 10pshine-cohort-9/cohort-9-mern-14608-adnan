import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./config/logger.js";
import { validateEnv } from "./config/env.js";

let env: ReturnType<typeof validateEnv>;
try {
  env = validateEnv();
} catch (err) {
  logger.error({ err }, "Invalid environment configuration");
  process.exitCode = 1;
  throw err;
}

const rawPort = process.env.PORT || "5000";
const PORT = Number(rawPort);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  logger.error(`Invalid PORT value: ${rawPort}`);
  process.exitCode = 1;
  throw new Error(`Invalid PORT value: ${rawPort}`);
}

try {
  await connectDB(env.mongoUri);
} catch (err) {
  logger.error({ err }, "Failed to connect to the database");
  process.exitCode = 1;
  throw err;
}

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  logger.error({ err }, "Server failed to start");
  process.exit(1);
});
