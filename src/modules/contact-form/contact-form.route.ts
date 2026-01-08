import { Router } from "express";
import * as contactFormController from "./contact-form.controller";

const router = Router();

router.get("/", contactFormController.getPaginatedFormsController);

export default router;
