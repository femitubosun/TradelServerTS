import { Request } from "express";
import { User } from "Entities/User";

export type AuthRequest = Request & {
  user: User;
};
