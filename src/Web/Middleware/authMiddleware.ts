import { NextFunction, Request, Response } from "express";
import UsersService from "Logic/Services/Users/UsersService";
import { JwtHelper } from "Helpers/JwtHelper";
import { AuthRequest } from "Web/TypeChecking";
import { UnauthorizedError } from "Exceptions/UnauthorizedError";
import { UnauthenticatedError } from "Exceptions/UnauthenticatedError";

export const authMiddleware = async (
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
