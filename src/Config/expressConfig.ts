export const expressConfig = {
  ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT!, 10) || 8000,
  CORS_WHITELIST: JSON.parse(process.env.CORS_WHITELIST!),
};
