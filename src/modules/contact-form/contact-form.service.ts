import { prisma } from "../../config/prisma";
import ApiError from "../../utils/ApiError";

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

export const updateFormNote = async (
  id: number,
  { note }: { note: string }
) => {
  const form = await prisma.contactForm.findUnique({ where: { id } });
  if (!form) throw new ApiError(400, "Form not found!");

  return prisma.contactForm.update({ data: { note }, where: { id } });
};
