import { Router } from "express";
import * as publicValidator from "./public.validator";
import * as publicController from "./public.controller";

const router = Router();

router.get("/site-settings", publicController.getSiteSettingsController);

router.get("/gallery", publicController.getGalleryController);

router.get("/teachers", publicController.getTeachersController);

router.get("/upcoming-events", publicController.getUpcomingEventsController);

router.get("/upcoming-events/:id", publicController.getEventByIdController);

router.post(
  "/contact-form",
  publicValidator.validateContactForm,
  publicController.addContactFormController
);

export default router;
