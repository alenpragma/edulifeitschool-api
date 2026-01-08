import { Router } from "express";
import { successResponse } from "./utils/response";
import authRoutes from "./modules/auth/auth.route";
import siteSettingRoutes from "./modules/site-setting/site-setting.route";
import galleryRoutes from "./modules/gallery/gallery.route";
import teacherRoutes from "./modules/teacher/teacher.route";
import publicRoutes from "./modules/public/public.route";
import { authRequired } from "./middlewares/auth.middleware";

const router = Router();

router.get("/health", (_, res) => {
  return successResponse(res, { message: "ok" });
});

router.use("/auth", authRoutes);

router.use("/admin/site-settings", authRequired(), siteSettingRoutes);

router.use("/admin/gallery", authRequired(), galleryRoutes);

router.use("/admin/teachers", authRequired(), teacherRoutes);

router.use("/", publicRoutes);

export default router;
