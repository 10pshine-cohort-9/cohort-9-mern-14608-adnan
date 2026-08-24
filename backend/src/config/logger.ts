import pino, { type LevelWithSilent } from "pino";
import { isDev, isTest } from "./env.js";

interface LoggerEnv {
  isTest: boolean;
  isDev: boolean;
}

const resolveLoggerLevel = ({ isTest, isDev }: LoggerEnv): LevelWithSilent => {
  if (isTest) {
    return "silent";
  }
  if (isDev) {
    return "debug";
  }
  return "info";
};

const resolveLoggerTransport = ({ isDev: dev }: LoggerEnv) =>
  dev
    ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard" },
      }
    : undefined;

export const createLogger = (env?: LoggerEnv): ReturnType<typeof pino> => {
  const resolvedEnv = env ?? { isTest, isDev };
  const level = resolveLoggerLevel(resolvedEnv);
  const transport = resolveLoggerTransport(resolvedEnv);
  return pino({ level, transport });
};

const logger = createLogger();
export default logger;

