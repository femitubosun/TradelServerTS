export const dbConfig = {
  HOST: process.env.DATABASE_HOST,
  PORT: parseInt(process.env.DATABASE_PORT!, 10),
  USERNAME: process.env.DATABASE_USERNAME,
  PASSWORD: process.env.DATABASE_PASSWORD,
  DB_NAME: process.env.DATABASE_NAME,

  TEST_HOST: process.env.TEST_DATABASE_HOST,
  TEST_PORT: parseInt(process.env.TEST_DATABASE_PORT!, 10),
  TEST_USERNAME: process.env.TEST_DATABASE_USERNAME,
  TEST_PASSWORD: process.env.TEST_DATABASE_PASSWORD,
  TEST_DB_NAME: process.env.TEST_DATABASE_NAME,
};
