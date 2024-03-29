import { NextFunction, Request, Response } from "express";
import UsersService from "Api/Modules/Client/OnboardingAndAuthentication/Services/UsersService";
import { JwtHelper } from "Api/Modules/Common/Helpers/JwtHelper";
import { AuthRequest } from "../TypeChecking";

import { UnauthenticatedError } from "Api/Modules/Common/Exceptions/UnauthenticatedError";

export const isAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const token = await request.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new UnauthenticatedError();

  const decoded = JwtHelper.verifyToken(token);

  const { email } = decoded;

  const user = await UsersService.getUserByEmail(email);

  if (!user) throw new UnauthenticatedError();

  (request as AuthRequest).user = user;

  return next();
};
