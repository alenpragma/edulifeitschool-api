import { Request, Response, NextFunction } from "express";

const asyncWrapper =
  <Req extends Request = Request>(
    fn: (req: Req, res: Response, next: NextFunction) => Promise<any>
  ) =>
  (req: Req, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncWrapper;
