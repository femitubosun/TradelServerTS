import { Response } from "express";
import ApplicationError from "./ApplicationError";
import { HttpCode } from "./httpCode.enum";
import { CRITICAL_ERROR_EXITING, INTERNAL_SERVER_ERROR } from "Utils/Messages";

// https://www.codeconcisely.com/posts/how-to-handle-errors-in-express-with-typescript/
class ErrorHandler {
  private isTrustedError(error: Error): boolean {
    if (error instanceof ApplicationError) {
      return error.isOperational;
    }

    return false;
  }

  public handleError(
    error: Error | ApplicationError,
    response?: Response
  ): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as ApplicationError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private handleTrustedError(
    error: ApplicationError,
    response: Response
  ): void {
    response.status(error.httpCode).json({
      message: error.message,
      status: "error",
      status_code: error.httpCode,
    });
  }

  private handleCriticalError(
    error: Error | ApplicationError,
    response?: Response
  ): void {
    if (response) {
      response.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR,
        status: "error",
        status_code: HttpCode.INTERNAL_SERVER_ERROR,
      });
    }

    console.log(CRITICAL_ERROR_EXITING);
    process.exit(1);
  }
}

export const errorHandler = new ErrorHandler();
