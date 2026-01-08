import { body } from "express-validator";
import validator from "../../middlewares/validator.middleware";

export const validateAddNote = [
  body("note").notEmpty().withMessage("Note is required"),
  validator,
];
