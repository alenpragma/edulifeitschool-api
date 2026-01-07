import { Request, Response } from "express";
import * as siteSettingService from "./site-setting.service";
import asyncWrapper from "../../utils/asyncWrapper";
import { successResponse } from "../../utils/response";

export const upsertSiteSettingController = asyncWrapper(
  async (req: Request, res: Response) => {
    const parsedValue =
      typeof req.body.value === "string"
        ? JSON.parse(req.body.value)
        : req.body.value;

    const upserted = await siteSettingService.upsertSiteSetting(
      { ...req.body, value: parsedValue },
      req.file || null
    );

    return successResponse(res, {
      message: "Site settings updated successfully",
      data: upserted,
    });
  }
);

export const getSiteSettingsController = async (
  req: Request,
  res: Response
) => {
  const settings = await siteSettingService.getSiteSettings();

  return successResponse(res, {
    message: "Site settings retrived successfully",
    data: settings,
  });
};
