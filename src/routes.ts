import { Router } from "express";
import { successResponse } from "./utils/response";
import authRoutes from "./modules/auth/auth.route";
import siteSettingRoutes from "./modules/site-setting/site-setting.route";
import galleryRoutes from "./modules/gallery/gallery.route";
import teacherRoutes from "./modules/teacher/teacher.route";
import eventRoutes from "./modules/event/event.route";
import publicRoutes from "./modules/public/public.route";
import contactFormRoutes from "./modules/contact-form/contact-form.route";
import dashboardRoutes from "./modules/dashboard/dashboard.route";
import { authRequired } from "./middlewares/auth.middleware";

const router = Router();

router.get("/health", (_, res) => {
  return successResponse(res, { message: "ok" });
});

router.use("/auth", authRoutes);

router.use("/admin/site-settings", authRequired(), siteSettingRoutes);

router.use("/admin/gallery", authRequired(), galleryRoutes);

router.use("/admin/teachers", authRequired(), teacherRoutes);

router.use("/admin/events", authRequired(), eventRoutes);

router.use("/admin/contact-forms", authRequired(), contactFormRoutes);

router.use("/admin/dashboard", authRequired(), dashboardRoutes);

router.use("/", publicRoutes);

export default router;
