import fs from "node:fs";
import path from "node:path";
import { prisma } from "../../config/prisma";
import { AddTeacherInput } from "./teacher.type";
import { Teacher } from "../../generated/prisma/client";
import config from "../../config/env";
import ApiError from "../../utils/ApiError";

export const addTeacher = (
  { name, subject, qualification }: AddTeacherInput,
  file: Express.Multer.File | null
) => {
  const profileFile = file as Express.Multer.File & { publicPath: string };

  return prisma.teacher.create({
    data: {
      name,
      subject,
      qualification: qualification,
      profilePicture: profileFile ? profileFile.publicPath : null,
    },
  });
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

export const updateTeacher = async (
  id: number,
  { name, subject, qualification }: AddTeacherInput,
  file: Express.Multer.File | null
) => {
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) throw new ApiError(404, "Teacher not found!");

  let profilePicturePath = teacher.profilePicture;

  if (file) {
    const profileFile = file as Express.Multer.File & { publicPath: string };

    if (teacher.profilePicture) {
      const oldFilePath = path.join(
        process.cwd(),
        "public",
        teacher.profilePicture
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    profilePicturePath = profileFile.publicPath;
  }

  return prisma.teacher.update({
    where: { id },
    data: {
      name,
      subject,
      qualification,
      profilePicture: profilePicturePath,
    },
  });
};

export const deleteTeacher = async (id: number) => {
  const teacher = await prisma.teacher.findUnique({ where: { id } });
  if (!teacher) throw new ApiError(404, "Teacher not found!");

  if (teacher.profilePicture) {
    const filePath = path.join(process.cwd(), "public", teacher.profilePicture);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return prisma.teacher.delete({ where: { id } });
};
