import { Router } from "express";
import * as authValidator from "./auth.validator";
import * as authController from "./auth.controller";
import { authRequired } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/login",
  authValidator.validateLogin,
  authController.loginController
);

router.get("/me", authRequired(), authController.meController);

export default router;
