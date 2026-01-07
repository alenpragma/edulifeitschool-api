import { body } from "express-validator";
import validator from "../../middlewares/validator.middleware";

export const validateUpsert = [
  body("key")
    .notEmpty()
    .withMessage("Key is required")
    .isString()
    .withMessage("Key must be a string")
    .trim(),

  body("value")
    .notEmpty()
    .withMessage("Value is required")
    .custom((value) => {
      if (typeof value === "undefined") {
        throw new Error("Value must be valid JSON");
      }
      return true;
    }),

  validator,
];
