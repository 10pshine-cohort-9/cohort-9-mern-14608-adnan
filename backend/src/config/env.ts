const nodeEnv = process.env.NODE_ENV;

export const isProd = nodeEnv === "production";
export const isDev = nodeEnv === "development";
export const isTest = nodeEnv === "test";
