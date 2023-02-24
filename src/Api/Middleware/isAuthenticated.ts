import { NextFunction, Request, Response } from "express";
import UsersService from "Logic/Services/UsersService";
import { JwtHelper } from "Helpers/JwtHelper";
import { AuthRequest } from "../TypeChecking";

import { UnauthenticatedError } from "Exceptions/UnauthenticatedError";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new UnauthenticatedError();

  const decoded = JwtHelper.verifyToken(token);

  const { email } = decoded;

  const user = await UsersService.getUserByEmail(email);

  if (!user) throw new UnauthenticatedError();

  (req as AuthRequest).user = user;

  return next();
};
