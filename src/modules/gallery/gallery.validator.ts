import { body } from "express-validator";
import validator from "../../middlewares/validator.middleware";

export const validateReorder = [
  body("id").notEmpty().withMessage("ID is required"),
  body("newPosition").notEmpty().withMessage("New position is required"),
  validator,
];
