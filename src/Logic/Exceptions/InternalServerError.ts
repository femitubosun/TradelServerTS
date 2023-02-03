import ApplicationError from "./ApplicationError";

export class InternalServerError extends ApplicationError {
  constructor(description: string = "Internal Server Error") {
    super({
      description,
      httpCode: 422,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
