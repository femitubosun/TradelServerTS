import ApplicationError from "./ApplicationError";

export class UnauthorizedError extends ApplicationError {
  constructor(description: string = "Internal Server Error") {
    super({
      description,
      httpStatusCode: 401,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
