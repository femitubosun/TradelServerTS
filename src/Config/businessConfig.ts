import { DateTime } from "luxon";
import * as process from "process";

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

  paymentProvider: process.env.PAYMENT_PROVIDER,

  initialWalletBalance: Number(process.env.INITIAL_WALLET_BALANCE),
};
