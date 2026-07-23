import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.js";
import { isProd, isDev, isTest } from "../config/env.js";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode =
    res.statusCode >= 400 && res.statusCode < 600 ? res.statusCode : 500;
  const showStack = isDev || isTest;

  logger.error({ err, path: req.path, method: req.method }, err.message);

  res.status(statusCode).json({
    success: false,
    message: isProd && statusCode === 500 ? "Something went wrong" : err.message,
    stack: showStack ? err.stack : undefined,
  });
};

export default errorHandler;
