import { NextFunction, Response, Request } from "express";

export const asyncMiddlewareHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction): Function =>
    fn(req, res, next).catch(next);
