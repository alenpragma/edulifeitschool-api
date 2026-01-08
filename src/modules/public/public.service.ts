import path from "node:path";
import { prisma } from "../../config/prisma";
import config from "../../config/env";
import { ContactForm, Photo, SiteSetting } from "../../generated/prisma/client";
import { Teacher, Event } from "../../generated/prisma/client";

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export const getSiteSettings = async () => {
  const settings = await prisma.siteSetting.findMany();

  return Object.fromEntries(
    settings.map((s: SiteSetting) => {
      if (
        s.key === "hero" &&
        isObject(s.value) &&
        typeof s.value.heroImage === "string"
      ) {
        return [
          s.key,
          {
            ...s.value,
            heroImage: path.join(config.BASE_URL, s.value.heroImage),
          },
        ];
      }

      return [s.key, s.value];
    })
  );
};

export const getGallery = async () => {
  const photos = await prisma.photo.findMany({ orderBy: { position: "asc" } });

  return photos.map((photo: Photo) => ({
    ...photo,
    url: `${config.BASE_URL}${photo.url}`,
  }));
};

export const getTeachers = () =>
  prisma.teacher.findMany().then((teachers: Teacher[]) =>
    teachers.map((t) => ({
      ...t,
      profilePicture: t.profilePicture
        ? `${config.BASE_URL}${t.profilePicture}`
        : null,
    }))
  );

export const getUpcomingEvents = () =>
  prisma.event
    .findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: "asc",
      },
    })
    .then((events: Event[]) =>
      events.map((e) => ({
        ...e,
        icon: e.icon ? `${config.BASE_URL}${e.icon}` : null,
      }))
    );

export const addContactForm = ({
  name,
  phone,
  email,
  subject,
  message,
}: ContactForm) =>
  prisma.contactForm.create({ data: { name, phone, email, subject, message } });
