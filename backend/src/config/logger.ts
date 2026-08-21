import pino, { type LevelWithSilent } from "pino";
import { isDev, isTest } from "./env.js";

let level: LevelWithSilent;
if (isTest) {
  level = "silent";
} else if (isDev) {
  level = "debug";
} else {
  level = "info";
}

const logger = pino({
  level,
  transport: isDev
    ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard" },
      }
    : undefined,
});

export default logger;
