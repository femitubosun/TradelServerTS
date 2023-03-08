import { User } from "Api/Modules/Client/OnboardingAndAuthentication/Entities/User";

export type EmailVerificationArgs = {
  emailVerificationToken: string;
  user: User;
};
