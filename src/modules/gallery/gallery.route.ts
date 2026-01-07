import { Router } from "express";
import * as galleryValidator from "./gallery.validator";
import * as galleryController from "./gallery.controller";
import { createDynamicUploader } from "../../middlewares/multer.middleware";

const router = Router();
const upload = createDynamicUploader((field) => {
  return {
    folder: "site-settings",
    array: { prefix: "gallery", strategy: "uuid" },
  };
});

router.post("/", upload.array("files"), galleryController.addItemController);

router.get("/", galleryController.getItemsController);

router.post(
  "/reorder",
  galleryValidator.validateReorder,
  galleryController.reorderController
);

router.delete("/:id", galleryController.deleteItemController);

export default router;
