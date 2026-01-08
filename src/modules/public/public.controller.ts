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

export const getGalleryController = asyncWrapper(async (req, res) => {
  const gallery = await publicService.getGallery();

  return successResponse(res, {
    message: "Gallert retrived successfully",
    data: gallery,
  });
});

export const getTeachersController = asyncWrapper(async (req, res) => {
  const teachers = await publicService.getTeachers();

  return successResponse(res, {
    message: "Teachers retrived successfully",
    data: teachers,
  });
});

export const getUpcomingEventsController = asyncWrapper(async (req, res) => {
  const events = await publicService.getUpcomingEvents();

  return successResponse(res, {
    message: "Upcoming events retrived successfully",
    data: events,
  });
});

export const addContactFormController = asyncWrapper(async (req, res) => {
  await publicService.addContactForm(req.body);

  return successResponse(res, {
    status: 201,
    message: "Submitted successfully. We will reach you soon!",
  });
});
