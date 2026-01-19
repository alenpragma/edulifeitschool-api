import { Router } from "express";
import * as siteSettingValidator from "./site-setting.validator";
import * as siteSettingController from "./site-setting.controller";
import { createDynamicUploader } from "../../middlewares/multer.middleware";

const router = Router();

const upload = createDynamicUploader((field) => {
  switch (field) {
    case "heroImage":
      return { folder: "site-settings", filename: "hero-image" };
    case "bannerImage": // WhyChooseUs
      return { folder: "site-settings", filename: "why-choose-us-banner" };
    default:
      return { folder: "others" };
  }
});

// Upsert Hero
router.post(
  "/hero",
  upload.single("heroImage"),
  siteSettingValidator.validateUpsert,
  siteSettingController.upsertSiteSettingController,
);

// Upsert WhyChooseUs
router.post(
  "/why-choose-us",
  upload.single("bannerImage"),
  siteSettingValidator.validateUpsert,
  siteSettingController.upsertSiteSettingController,
);

// Get all site settings
router.get("/", siteSettingController.getSiteSettingsController);

export default router;
