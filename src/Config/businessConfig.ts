import { DateTime } from "luxon";

export const businessConfig = {
  emailTokenLength: parseInt(process.env.EMAIL_TOKEN_LENGTH, 10),

  passwordResetTokenLength: parseInt(process.env.PASSWORD_RESET_TOKEN_LENGTH),

  emailTokenExpiresInMinutes: parseInt(
    process.env.EMAIL_TOKEN_EXPIRES_IN_MINUTES,
    10
  ),

  passwordResetTokenExpiresInMinutes: parseInt(
    process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES,
    10
  ),

  currentDateTime: () => DateTime.now(),

  host: process.env.HOST,

  passwordResetTokenLink: `${process.env.HOST}/Interface/Process/ResetPassword`,
};
