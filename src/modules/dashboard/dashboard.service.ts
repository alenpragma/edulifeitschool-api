import { prisma } from "../../config/prisma";

export const getDashboardCounts = async () => {
  const now = new Date();

  // Parallel queries for efficiency
  const [teacherCount, galleryCount, upcomingEventCount, unreadContactCount] =
    await Promise.all([
      prisma.teacher.count(),
      prisma.photo.count(),
      prisma.event.count({
        where: {
          date: {
            gte: now,
          },
        },
      }),
      prisma.contactForm.count({
        where: {
          OR: [{ note: null }, { note: "" }],
        },
      }),
    ]);

  return {
    teacherCount,
    galleryCount,
    upcomingEventCount,
    unreadContactCount,
  };
};
