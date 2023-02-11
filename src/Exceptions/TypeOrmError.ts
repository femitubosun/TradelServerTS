import ApplicationError from "./ApplicationError";

export class TypeOrmError extends ApplicationError {
  constructor(description: string = "TypeOrm Error") {
    super({
      description,
      httpStatusCode: 422,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
