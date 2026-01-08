import fs from "node:fs";
import path from "node:path";
import { prisma } from "../../config/prisma";
import { Event } from "../../generated/prisma/client";
import config from "../../config/env";
import { AddEventInput } from "./event.type";

export const addEvent = (
  { title, time, location, date }: AddEventInput,
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
    },
  });
};

export const getEvents = () =>
  prisma.event.findMany().then((events: Event[]) =>
    events.map((e) => ({
      ...e,
      icon: e.icon ? `${config.BASE_URL}${e.icon}` : null,
    }))
  );

export const updateEvent = async (
  id: number,
  { title, time, location, date }: AddEventInput,
  file: Express.Multer.File | null
) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new Error("Event not found");

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
    },
  });
};

export const deleteEvent = async (id: number) => {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw new Error("Event not found");

  if (event.icon) {
    const filePath = path.join(process.cwd(), "public", event.icon);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return prisma.event.delete({ where: { id } });
};
