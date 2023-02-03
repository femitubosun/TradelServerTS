import ApplicationError from "./ApplicationError";

export class BadRequestError extends ApplicationError {
  constructor(description: string = "Bad Request Error") {
    super({
      description,
      httpCode: 400,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
