import { Router } from "express";
import * as publicController from "./public.controller";

const router = Router();

router.get("/site-settings", publicController.getSiteSettingsController);

router.get("/gallery", publicController.getGalleryController);

router.get("/teachers", publicController.getTeachersController);

export default router;
