import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.js";
import { isDev, isTest } from "../config/env.js";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode =
    res.statusCode >= 400 && res.statusCode < 600 ? res.statusCode : 500;
  const showDetails = isDev || isTest;

  logger.error({ err, path: req.path, method: req.method }, err.message);

  res.status(statusCode).json({
    success: false,
    message: showDetails || statusCode !== 500 ? err.message : "Something went wrong",
    stack: showDetails ? err.stack : undefined,
  });
};

export default errorHandler;
