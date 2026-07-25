import jwt, { SignOptions, Secret } from "jsonwebtoken";

const generateToken = (userId: string): string => {
  const secret: Secret = process.env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };
  return jwt.sign({ id: userId }, secret, options);
};

export default generateToken;
