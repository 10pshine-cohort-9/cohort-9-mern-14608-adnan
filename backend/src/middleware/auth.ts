import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

interface JwtPayload {
  id: string;
}

const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401);
    next(new Error("Not authorized, no token"));
    return;
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch (err) {
    res.status(401);
    next(new Error("Not authorized, invalid token"));
    return;
  }

  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      next(new Error("Not authorized, user not found"));
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default protect;
