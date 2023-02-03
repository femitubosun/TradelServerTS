import { HttpCode } from "Logic/Exceptions/httpCode.enum";

interface ApplicationErrorArgs {
  httpCode: HttpCode;
  description: string;
  isOperational?: boolean;
}

export default class ApplicationError extends Error {
  public readonly description: string;
  public readonly httpCode: HttpCode;
  public readonly isOperational: boolean = true;

  constructor(applicationErrorArgs: ApplicationErrorArgs) {
    super(applicationErrorArgs.description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.httpCode = applicationErrorArgs.httpCode;

    if (applicationErrorArgs.isOperational !== undefined) {
      this.isOperational = applicationErrorArgs.isOperational;
    }

    Error.captureStackTrace(this);
  }
}
