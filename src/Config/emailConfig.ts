export const emailConfig = {
  SEND_IN_BLUE: {
    SMTP_HOST: process.env.SEND_IN_BLUE_SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SEND_IN_BLUE_SMTP_PORT!, 10),
    SMTP_USERNAME: process.env.SEND_IN_BLUE_SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SEND_IN_BLUE_SMTP_PASSWORD,
  },
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
};
