import * as galleryService from "./gallery.service";
import { successResponse } from "../../utils/response";
import asyncWrapper from "../../utils/asyncWrapper";

export const addItemController = asyncWrapper(async (req, res) => {
  const data = await galleryService.addItem(
    req.files as Record<string, Express.Multer.File[]>
  );

  return successResponse(res, { message: "Gallery updated", data });
});

export const getItemsController = asyncWrapper(async (req, res) => {
  const photos = await galleryService.getItems();

  return successResponse(res, { message: "Gallery retrived", data: photos });
});

export const reorderController = asyncWrapper(async (req, res) => {
  await galleryService.reorder(req.body);

  return successResponse(res, { message: "Gallery reordered" });
});

export const deleteItemController = asyncWrapper(async (req, res) => {
  await galleryService.deleteItem(Number(req.params.id));

  return successResponse(res, { message: "Item deleted" });
});
