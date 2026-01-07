import fs from "node:fs/promises";
import path from "node:path";
import config from "../../config/env";
import { prisma } from "../../config/prisma";
import ApiError from "../../utils/ApiError";
import { ReorderInput } from "./gallery.type";
import { Photo } from "../../generated/prisma/client";

export const addItem = async (
  files: Record<string, Express.Multer.File[] | null>
) => {
  const allFiles = Object.values(files).flat();

  if (!allFiles || allFiles.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  const startPosition = await prisma.photo.count();

  const photosData = allFiles.map((file, index) => ({
    url: (file as any).publicPath,
    position: startPosition + index,
  }));

  return prisma.photo.createMany({
    data: photosData,
  });
};

export const getItems = async () => {
  const photos = await prisma.photo.findMany({ orderBy: { position: "asc" } });

  return photos.map((photo: Photo) => ({
    ...photo,
    url: `${config.BASE_URL}${photo.url}`,
  }));
};

export const reorder = async ({ id, newPosition }: ReorderInput) => {
  const movingPhoto = await prisma.photo.findUnique({ where: { id } });
  if (!movingPhoto) throw new Error("Photo not found");

  const oldPosition = movingPhoto.position;

  if (oldPosition === newPosition) return movingPhoto;

  if (oldPosition < newPosition) {
    await prisma.photo.updateMany({
      where: {
        position: { gt: oldPosition, lte: newPosition },
      },
      data: {
        position: { decrement: 1 },
      },
    });
  } else {
    await prisma.photo.updateMany({
      where: {
        position: { gte: newPosition, lt: oldPosition },
      },
      data: {
        position: { increment: 1 },
      },
    });
  }

  return prisma.photo.update({
    where: { id },
    data: { position: newPosition },
  });
};

export const deleteItem = async (id: number) => {
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) throw new ApiError(404, "Photo not found");

  const deletedPosition = photo.position;

  try {
    const filePath = path.join(process.cwd(), "public", photo.url);
    await fs.unlink(filePath);
  } catch (err: any) {
    console.warn("Failed to delete file:", err.message);
  }

  await prisma.photo.delete({ where: { id } });

  await prisma.photo.updateMany({
    where: { position: { gt: deletedPosition } },
    data: { position: { decrement: 1 } },
  });

  return { id };
};
