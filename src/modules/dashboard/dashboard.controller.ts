import * as dashboardService from "./dashboard.service";
import { successResponse } from "../../utils/response";
import asyncWrapper from "../../utils/asyncWrapper";

export const getDashboardCountsController = asyncWrapper(async (req, res) => {
  const stats = await dashboardService.getDashboardCounts();

  return successResponse(res, {
    status: 201,
    message: "Dashboard stats retrived successfully",
    data: stats,
  });
});
