import { NextFunction, Request, Response } from "express";
import UsersService from "Logic/Services/UsersService";
import SettingsUserRoleService from "Logic/Services/SettingsUserRoleService";
import { JwtHelper } from "Helpers/JwtHelper";
import { AuthRequest } from "../TypeChecking";

import { UnauthorizedError } from "Exceptions/UnauthorizedError";
import { UnauthenticatedError } from "Exceptions/UnauthenticatedError";
import { NULL_OBJECT } from "Helpers/Messages/SystemMessages";

export const isRole =
  (roles: string[]) =>
  async (request: Request, response: Response, next: NextFunction) => {
    const token = await request.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new UnauthenticatedError();

    const decoded = JwtHelper.verifyToken(token);

    const { email } = decoded;

    const user = await UsersService.getUserByEmail(email);

    if (user === NULL_OBJECT) throw new UnauthorizedError();

    const role = await SettingsUserRoleService.getUserRoleById(user.roleId);

    if (role === NULL_OBJECT) throw new UnauthorizedError();

    const IS_NOT_MEMBER = false;

    const isMember = roles.includes(role.name);

    if (isMember === IS_NOT_MEMBER) throw new UnauthorizedError();

    (request as AuthRequest).user = user;

    return next();
  };
