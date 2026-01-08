import { Router } from "express";
import * as contactFormValidator from "./contact-form.validator";
import * as contactFormController from "./contact-form.controller";

const router = Router();

router.get("/", contactFormController.getPaginatedFormsController);

router.put(
  "/:id/note",
  contactFormValidator.validateAddNote,
  contactFormController.updateFormNoteController
);

export default router;
