export const dbConfig = {
  HOST: process.env.DATABASE_HOST,
  PORT: parseInt(process.env.DATABASE_PORT!, 10),
  USERNAME: process.env.DATABASE_USERNAME,
  PASSWORD: process.env.DATABASE_PASSWORD,
  DB_NAME: process.env.DATABASE_NAME,
};
