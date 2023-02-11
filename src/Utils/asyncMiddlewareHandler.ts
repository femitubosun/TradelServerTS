import { NextFunction, Response, Request } from "express";

export const asyncMiddlewareHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction): any =>
    fn(req, res, next).catch(next);
