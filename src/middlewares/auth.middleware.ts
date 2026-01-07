import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { errorResponse } from "../utils/response";

export const authRequired =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: { id: string; role: string }) => {
        if (err) return next(err);

        if (!user) {
          return errorResponse(res, {
            status: 401,
            message: "You are not authorized!",
          });
        }

        if (roles.length && !roles.includes(user.role)) {
          return errorResponse(res, {
            status: 403,
            message: "You don't have permisson to access this resource!",
          });
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  };
