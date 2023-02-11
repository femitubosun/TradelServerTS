export const emailConfig = {
  sendinblue: {
    host: process.env.SEND_IN_BLUE_SMTP_HOST!,
    port: parseInt(process.env.SEND_IN_BLUE_SMTP_PORT!, 10)!,
    user: process.env.SEND_IN_BLUE_SMTP_USERNAME!,
    pass: process.env.SEND_IN_BLUE_SMTP_PASSWORD!,
    secure: false,
    apiKey: process.env.SEND_IN_BLUE_API_KEY!,
  },
  provider: process.env.EMAIL_PROVIDER!,
  sendgrid: {
    host: process.env.SEND_GRID_SMTP_HOST!,
    port: parseInt(process.env.SEND_GRID_SMTP_PORT!, 10),
    user: process.env.SEND_GRID_SMTP_USERNAME!,
    pass: process.env.SEND_GRID_SMTP_PASSWORD!,
    secure: false,
  },
  emailFromEmail: process.env.EMAIL_FROM_EMAIL!,
  emailFromName: process.env.EMAIL_FROM_NAME,
  emailSecure: false,
};
