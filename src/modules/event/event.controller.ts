import * as eventService from "./event.service";
import asyncWrapper from "../../utils/asyncWrapper";
import { successResponse } from "../../utils/response";

export const addEventController = asyncWrapper(async (req, res) => {
  const newEvent = await eventService.addEvent(req.body, req.file || null);

  return successResponse(res, {
    status: 201,
    message: "Event added successfully",
    data: newEvent,
  });
});

export const getEventsController = asyncWrapper(async (req, res) => {
  const { data, meta } = await eventService.getPaginatedEvents(req.query);

  return successResponse(res, {
    message: "Events retrieved successfully",
    data,
    meta,
  });
});

export const updateEventController = asyncWrapper(async (req, res) => {
  const updatedEvent = await eventService.updateEvent(
    req.params.id,
    req.body,
    req.file || null
  );

  return successResponse(res, {
    message: "Event updated successfully",
    data: updatedEvent,
  });
});

export const deleteEventController = asyncWrapper(async (req, res) => {
  await eventService.deleteEvent(req.params.id);

  return successResponse(res, {
    message: "Event deleted successfully",
  });
});
