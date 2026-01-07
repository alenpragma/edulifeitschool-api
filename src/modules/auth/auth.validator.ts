import { body } from "express-validator";
import validator from "../../middlewares/validator.middleware";

// Login validation middleware
export const validateLogin = [
  body("email").isEmail().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validator,
];
