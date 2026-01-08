import { Router } from "express";
import * as teacherValidator from "./teacher.validator";
import * as teacherController from "./teacher.controller";
import { createDynamicUploader } from "../../middlewares/multer.middleware";

const router = Router();
const upload = createDynamicUploader((field) => {
  if (field === "profilePicture") {
    return {
      folder: "teachers",
    };
  }

  return { folder: "others" };
});

router.post(
  "/",
  upload.single("profilePicture"),
  teacherValidator.validateAddTeacher,
  teacherController.addTeacherController
);

router.get("/", teacherController.getTeachersController);

router.put(
  "/:id",
  upload.single("profilePicture"),
  teacherValidator.validateUpdateTeacher,
  teacherController.updateTeacherController
);

router.delete("/:id", teacherController.deleteTeacherController);

export default router;
