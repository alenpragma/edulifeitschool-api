import fs from "node:fs";
import path from "node:path";
import { prisma } from "../../config/prisma";
import { Event } from "../../generated/prisma/client";
import config from "../../config/env";
import { AddEventInput } from "./event.type";
import ApiError from "../../utils/ApiError";

export const addEvent = (
  { title, time, location, date, entryFee, description }: AddEventInput,
  file: Express.Multer.File | null
) => {
  const iconFile = file as Express.Multer.File & { publicPath: string };

  return prisma.event.create({
    data: {
      title,
      time,
      location,
      date: new Date(date),
      icon: iconFile ? iconFile.publicPath : null,
      entryFee,
      description,
    },
  });
};

export const getPaginatedEvents = async ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}) => {
  const skip = (page - 1) * limit;

  const [total, events] = await Promise.all([
    prisma.event.count(),
    prisma.event.findMany({
      skip,
      take: Number(limit),
      orderBy: {
        date: "asc",
      },
    }),
  ]);

  const data = events.map((e) => ({
    ...e,
    icon: e.icon ? `${config.BASE_URL}${e.icon}` : null,
  }));

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateEvent = async (
  id: string,
  { title, time, location, date, description, entryFee }: AddEventInput,
  file: Express.Multer.File | null
) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new ApiError(404, "Event not found!");

  let iconPath = event.icon;

  if (file) {
    const iconFile = file as Express.Multer.File & { publicPath: string };

    if (event.icon) {
      const oldFilePath = path.join(process.cwd(), "public", event.icon);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    iconPath = iconFile.publicPath;
  }

  return prisma.event.update({
    where: { id },
    data: {
      title,
      time,
      location,
      date: new Date(date),
      icon: iconPath,
      entryFee,
      description,
    },
  });
};

export const deleteEvent = async (id: string) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new ApiError(404, "Event not found!");

  if (event.icon) {
    const filePath = path.join(process.cwd(), "public", event.icon);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return prisma.event.delete({ where: { id } });
};
