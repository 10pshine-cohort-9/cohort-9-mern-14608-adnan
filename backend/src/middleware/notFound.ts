import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Route not found - ${req.path}`);
  res.status(404);
  next(error);
};

export default notFound;
