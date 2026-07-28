import pino from "pino";
import { isDev, isTest } from "./env.js";

const logger = pino({
  level: isTest ? "silent" : isDev ? "debug" : "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard" },
      }
    : undefined,
});

export default logger;
