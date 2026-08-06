import { Request, Response, NextFunction, CookieOptions } from "express";
import ms from "ms";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: ms((process.env.JWT_EXPIRES_IN || "7d") as ms.StringValue),
};

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface MongoDuplicateKeyError extends Error {
  code?: number;
}

export const register = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password }).catch((err: MongoDuplicateKeyError) => {
      if (err?.code === 11000) {
        res.status(409);
        throw new Error("Email already in use");
      }
      throw err;
    });

    const token = generateToken(user.id);
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie("token", cookieOptions);
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (err) {
    next(err);
  }
};
