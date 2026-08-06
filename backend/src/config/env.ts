export const isProd: boolean = process.env.NODE_ENV === "production";
export const isDev: boolean = process.env.NODE_ENV === "development";
export const isTest: boolean = process.env.NODE_ENV === "test";

interface EnvConfig {
  jwtSecret: string;
  mongoUri: string;
}

export const validateEnv = (): EnvConfig => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is missing or too short. Set a real random secret (32+ chars).");
  }
  const uniqueChars = new Set(secret).size;
  if (uniqueChars < 16) {
    throw new Error("JWT_SECRET looks low-entropy (too few unique characters). Generate a real random secret.");
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing.");
  }

  return { jwtSecret: secret, mongoUri };
};
