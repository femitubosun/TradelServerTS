declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL_TOKEN_LENGTH: string;
      EMAIL_TOKEN_EXPIRES_IN_MINUTES: string;
      PASSWORD_RESET_TOKEN_LENGTH: string;
      PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES: string;
      HOST: string;
      EXPRESS_PORT: string;
      EXPRESS_NODE_ENV: string;
      NODE_ENV: string;
      EXPRESS_CORS_WHITELIST: string;
      LOGGING_PROVIDER: "winston";
      DATABASE_HOST: string;
      DATABASE_PORT: string;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      TEST_DATABASE_HOST: string;
      TEST_DATABASE_PORT: string;
      TEST_DATABASE_USERNAME: string;
      TEST_DATABASE_PASSWORD: string;
      TEST_DATABASE_NAME: string;
      BCRYPT_SALT_ROUNDS: string;
      EMAIL_PROVIDER: "sendinblue" | "sendgrid";
      EMAIL_FROM_EMAIL: string;
      EMAIL_FROM_NAME: string;
      SEND_IN_BLUE_API_KEY: string;
      SEND_GRID_SMTP_HOST: string;
      SEND_GRID_SMTP_PORT: string;
      SEND_GRID_SMTP_USERNAME: string;
      SEND_GRID_SMTP_PASSWORD: string;
      JWT_SECRET: string;
      LOG_LEVEL: string;
      MONGO_URI: string;
    }
  }
}

export {};
