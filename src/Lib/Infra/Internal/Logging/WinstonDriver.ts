import winston from "winston";
import { ILoggingDriver } from "Lib/Infra/Internal/Logging/ILoggingDriver";

export class WinstonDriver implements ILoggingDriver {
  winston: winston.Logger;

  constructor() {
    const customLogFormat = winston.format.printf(
      ({ timestamp, message, level }) => {
        return `[${level.toUpperCase()}] ${timestamp} ${message}`;
      }
    );
    this.winston = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          level: "warn",
          filename: "logsWarnings",
        }),
        new winston.transports.File({
          level: "error",
          filename: "logs/logsErrors",
        }),
      ],
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        customLogFormat
      ),
    });
  }

  async info(data: any) {
    return this.winston.info(data);
  }

  error(data: any) {
    return this.winston.error(data);
  }
}
