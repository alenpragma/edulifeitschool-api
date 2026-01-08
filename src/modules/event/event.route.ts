import { Router } from "express";
import * as eventValidator from "./event.validator";
import * as eventController from "./event.controller";
import { createDynamicUploader } from "../../middlewares/multer.middleware";

const router = Router();
const upload = createDynamicUploader((field) => {
  if (field === "icon") {
    return {
      folder: "events",
    };
  }

  return { folder: "others" };
});

router.post(
  "/",
  upload.single("icon"),
  eventValidator.validateAddEvent,
  eventController.addEventController
);

router.get("/", eventController.getEventsController);

router.put(
  "/:id",
  upload.single("icon"),
  eventValidator.validateUpdateEvent,
  eventController.updateEventController
);

router.delete("/:id", eventController.deleteEventController);

export default router;
