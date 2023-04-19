import { DateTime } from "luxon";
import * as process from "process";

export const businessConfig = {
  emailTokenLength: parseInt(process.env["EMAIL_TOKEN_LENGTH"]!, 10),

  passwordResetTokenLength: parseInt(
    process.env["PASSWORD_RESET_TOKEN_LENGTH"]!
  ),

  emailTokenExpiresInMinutes: parseInt(
    process.env["EMAIL_TOKEN_EXPIRES_IN_MINUTES"]!,
    10
  ),

  passwordResetTokenExpiresInMinutes: parseInt(
    process.env["PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES"]!,
    10
  ),

  currentDateTime: () => DateTime.now(),

  host: process.env["HOST"]!,

  passwordResetTokenLink: `${process.env[
    "HOST"
  ]!}/Interface/Process/ResetPassword`,

  paymentProvider: process.env["PAYMENT_PROVIDER"]!,

  initialWalletBalance: Number(process.env["INITIAL_WALLET_BALANCE"]!),

  paystack: {
    apiKey: process.env["PAYSTACK_API_KEY"],
    initializeApiUrl: process.env["PAYSTACK_INITIALIZE_TRANSACTION_URL"],
    verifyApiUrl: process.env["PAYSTACK_VERIFY_TRANSACTION_URL"],
  },

  externalTransactionReferenceLength: Number(
    process.env["EXTERNAL_TRANSACTION_REFERENCE_LENGTH"]
  ),
};
