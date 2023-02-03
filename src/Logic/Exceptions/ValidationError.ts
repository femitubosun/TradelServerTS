import ApplicationError from "./ApplicationError";

export class ValidationError extends ApplicationError {
  constructor(description: string = "Validation Error") {
    super({
      description,
      httpCode: 422,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
