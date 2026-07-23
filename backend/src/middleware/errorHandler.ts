import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.js";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode =
    res.statusCode >= 400 && res.statusCode < 600 ? res.statusCode : 500;
  const isProd = process.env.NODE_ENV === "production";

  logger.error({ err, path: req.path, method: req.method }, err.message);

  res.status(statusCode).json({
    success: false,
    message: isProd && statusCode === 500 ? "Something went wrong" : err.message,
    stack: isProd ? undefined : err.stack,
  });
};

export default errorHandler;
