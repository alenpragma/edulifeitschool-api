import * as publicService from "./public.service";
import asyncWrapper from "../../utils/asyncWrapper";
import { successResponse } from "../../utils/response";

export const getSiteSettingsController = asyncWrapper(async (req, res) => {
  const settings = await publicService.getSiteSettings();

  return successResponse(res, {
    message: "Site settings retrived successfully",
    data: settings,
  });
});
