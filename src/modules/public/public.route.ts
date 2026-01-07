import { Router } from "express";
import * as publicController from "./public.controller";

const router = Router();

router.get("/site-settings", publicController.getSiteSettingsController);

export default router;
