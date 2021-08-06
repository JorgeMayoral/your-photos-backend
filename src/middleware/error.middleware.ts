import { NextFunction, Request, Response } from "express";

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error("Not found");
  res.status(404);
  next(error);
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = res.statusCode === 2000 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    error: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : null,
  });
};
