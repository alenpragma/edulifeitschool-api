import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import { errorResponse } from "../utils/response";

const validator = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const extractedErrors: Record<string, string> = {};

  result.array().forEach((err: ValidationError) => {
    if (err.type === "field") {
      extractedErrors[err.path] = err.msg as string;
    }
  });

  return errorResponse(res, {
    status: 400,
    message: "Missing or invalid parameters",
    errors: extractedErrors,
  });
};

export default validator;
