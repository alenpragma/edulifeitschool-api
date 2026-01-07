import { Request, Response } from "express";
import * as authService from "./auth.service";
import { successResponse } from "../../utils/response";
import asyncWrapper from "../../utils/asyncWrapper";

export const loginController = asyncWrapper(
  async (req: Request, res: Response) => {
    const accessToken = await authService.login(req.body);

    return successResponse(res, {
      message: "Login successful",
      data: { accessToken },
    });
  }
);

export const meController = asyncWrapper(
  async (req: Request, res: Response) => {
    const me = await authService.me(req.user.id);

    return successResponse(res, {
      message: "Logged-in user retrived successfully",
      data: me,
    });
  }
);
