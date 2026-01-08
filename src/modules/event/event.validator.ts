import { body } from "express-validator";
import validator from "../../middlewares/validator.middleware";

export const validateAddEvent = [
  body("title").notEmpty().withMessage("Title is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  validator,
];

export const validateUpdateEvent = [
  body("title").notEmpty().withMessage("Title is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  validator,
];
