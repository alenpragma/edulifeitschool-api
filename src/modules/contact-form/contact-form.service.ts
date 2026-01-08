import { prisma } from "../../config/prisma";

export const getPaginatedForms = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const [total, data] = await Promise.all([
    prisma.contactForm.count(),
    prisma.contactForm.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
  ]);

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
