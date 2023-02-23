import { DateTime } from "luxon";

export const businessConfig = {
  userTokenLength: parseInt(process.env.USER_TOKEN_LENGTH!, 10),

  emailTokenExpiresInMinutes: parseInt(
    process.env.EMAIL_TOKEN_EXPIRES_IN_MINUTES,
    10
  ),

  passwordResetTokenExpiresInMinutes: parseInt(
    process.env.PASSWORD_REST_TOKEN_EXPIRES_IN_MINUTES,
    10
  ),

  currentDateTime: DateTime.now(),
};
