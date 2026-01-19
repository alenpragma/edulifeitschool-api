import { Router } from "express";
import * as siteSettingValidator from "./site-setting.validator";
import * as siteSettingController from "./site-setting.controller";
import { createDynamicUploader } from "../../middlewares/multer.middleware";

const router = Router();
const upload = createDynamicUploader((field) => {
  switch (field) {
    case "heroImage":
      return { folder: "site-settings", filename: "hero-image" };
    case "bannerImage":
      return { folder: "site-settings", filename: "why-choose-us-banner" };
    default:
      return { folder: "others" };
  }
});

router.post(
  "/",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  siteSettingValidator.validateUpsert,
  siteSettingController.upsertSiteSettingController,
);

router.get("/", siteSettingController.getSiteSettingsController);

export default router;
