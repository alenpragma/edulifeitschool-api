import { Response } from "express";

// Send a standardized success response
export const successResponse = (
  res: Response,
  {
    status = 200,
    message = "Success",
    data = null,
    meta = null,
  }: {
    status?: number;
    message?: string;
    data?: any;
    meta?: any;
  }
) =>
  res.status(status).json({
    success: true,
    message,
    ...(data && { data }),
    ...(meta && { meta }),
  });

// Send a standardized error response
export const errorResponse = (
  res: Response,
  {
    status = 500,
    message = "Something went wrong",
    errors = null,
  }: {
    status?: number;
    message?: string;
    errors?: any;
  }
) =>
  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
