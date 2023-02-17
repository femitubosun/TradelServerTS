import { NextFunction, Request, Response } from "express";
import UsersService from "Logic/Services/Users/UsersService";
import { JwtHelper } from "Helpers/JwtHelper";
import { AuthRequest } from "../TypeChecking";

import { UnauthenticatedError } from "Exceptions/UnauthenticatedError";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = await req.header("Authorization")?.replace("Bearer ", "")!;

  if (!token) throw new UnauthenticatedError();

  const decoded: any = JwtHelper.verifyToken(token);

  const user = await UsersService.getUserByEmail(decoded.email);

  if (!user) throw new UnauthenticatedError();

  (req as AuthRequest).user = user;

  return next();
};
