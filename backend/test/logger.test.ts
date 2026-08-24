import { expect } from "chai";
import logger, { createLogger } from "../src/config/logger.js";

describe("logger", () => {
  it("creates a pino logger instance", () => {
    expect(logger).to.exist;
    expect(typeof logger.info).to.equal("function");
    expect(typeof logger.error).to.equal("function");
  });

  it("uses the silent level in test environments", () => {
    const testLogger = createLogger({ isTest: true, isDev: false });
    expect(testLogger.level).to.equal("silent");
  });

  it("uses the debug level and pretty transport in development", () => {
    const devLogger = createLogger({ isTest: false, isDev: true });
    expect(devLogger.level).to.equal("debug");
  });

  it("uses the info level in production", () => {
    const prodLogger = createLogger({ isTest: false, isDev: false });
    expect(prodLogger.level).to.equal("info");
  });
});
