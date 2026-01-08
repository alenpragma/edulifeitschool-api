import { body } from "express-validator";
import validator from "../../middlewares/validator.middleware";

const BD_PHONE_REGEX = /^(?:\+?8801[3-9]\d{8}|01[3-9]\d{8})$/;

export const validateContactForm = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 150 })
    .withMessage("Name can be max 150 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .matches(BD_PHONE_REGEX)
    .withMessage("Invalid Bangladesh phone number"),

  body("email")
    .optional({ nullable: true })
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 150 })
    .withMessage("Email can be max 150 characters"),

  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 150 })
    .withMessage("Subject can be max 150 characters"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 1000 })
    .withMessage("Message can be max 1000 characters"),

  validator,
];
