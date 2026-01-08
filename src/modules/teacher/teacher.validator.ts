import { body } from "express-validator";
import validator from "../../middlewares/validator.middleware";

export const validateAddTeacher = [
  body("name").notEmpty().withMessage("Name is required"),
  body("subject").notEmpty().withMessage("Subject is required"),
  body("qualification").notEmpty().withMessage("Qualification is required"),
  validator,
];

export const validateUpdateTeacher = [
  body("name").notEmpty().withMessage("Name is required"),
  body("subject").notEmpty().withMessage("Subject is required"),
  body("qualification").notEmpty().withMessage("Qualification is required"),
  validator,
];
