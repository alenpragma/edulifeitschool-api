import * as teacherService from "./teacher.service";
import asyncWrapper from "../../utils/asyncWrapper";
import { successResponse } from "../../utils/response";

export const addTeacherController = asyncWrapper(async (req, res) => {
  const newTeacher = await teacherService.addTeacher(
    req.body,
    req.file || null
  );
  return successResponse(res, {
    status: 201,
    message: "Teacher added successfully",
    data: newTeacher,
  });
});

export const getTeachersController = asyncWrapper(async (req, res) => {
  const teachers = await teacherService.getTeachers();

  return successResponse(res, {
    message: "Teachers retrived successfully",
    data: teachers,
  });
});

export const updateTeacherController = asyncWrapper(async (req, res) => {
  const updated = await teacherService.updateTeacher(
    Number(req.params.id),
    req.body,
    req.file || null
  );

  return successResponse(res, {
    message: "Teacher updated successfully",
    data: updated,
  });
});

export const deleteTeacherController = asyncWrapper(async (req, res) => {
  await teacherService.deleteTeacher(Number(req.params.id));

  return successResponse(res, { message: "Teacher deleted successfully" });
});
