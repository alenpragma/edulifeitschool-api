import { Router } from "express";
import * as dashboardController from "./dashboard.controller";

const router = Router();

router.get("/", dashboardController.getDashboardCountsController);

export default router;
