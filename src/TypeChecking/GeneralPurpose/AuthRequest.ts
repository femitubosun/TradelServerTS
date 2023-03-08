import { Request } from "express";
import { User } from "Api/Modules/Client/OnboardingAndAuthentication/Entities/User";

export type AuthRequest = Request & {
  user: User;
};
