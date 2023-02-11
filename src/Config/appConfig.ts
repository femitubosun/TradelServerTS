export const appConfig = {
  userTokenLength: parseInt(process.env.USER_TOKEN_LENGTH!, 10),
  emailTokenExpiresInMinutes: parseInt(
    process.env.EMAIL_TOKEN_EXPIRES_IN_MINUTES!,
    10
  ),
};
