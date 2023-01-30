import winston from "winston";
import { expressConfig, loggingConfig } from "Src/Config/";

const transports = [];

if (expressConfig.ENV !== "development") {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  );
}

const loggerService = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      level: "warn",
      filename: "logWarnings.log",
    }),
    new winston.transports.File({
      level: "error",
      filename: "logErrors.log",
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.json()
  ),
});

export default loggerService;
