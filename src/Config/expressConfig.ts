export const expressConfig = {
  ENV: process.env.EXPRESS_NODE_ENV,
  PORT: parseInt(process.env.EXPRESS_PORT!, 10) || 8000,
  CORS_WHITELIST: JSON.parse(process.env.EXPRESS_CORS_WHITELIST!),
};
