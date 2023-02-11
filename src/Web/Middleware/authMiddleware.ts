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

  (req as AuthRequest).user = await UsersService.findUserByEmail(decoded.email);

  return next();
};
