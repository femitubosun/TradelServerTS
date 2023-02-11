import { User } from "Entities/User";

export type EmailVerificationArgs = {
  emailVerificationToken: string;
  user: User;
};
