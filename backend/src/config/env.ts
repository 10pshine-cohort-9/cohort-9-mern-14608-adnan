export const isProd: boolean = process.env.NODE_ENV === "production";
export const isDev: boolean = process.env.NODE_ENV === "development";
export const isTest: boolean = process.env.NODE_ENV === "test";

export const validateEnv = (): void => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is missing or too short. Set a real random secret (32+ chars).");
  }
};
