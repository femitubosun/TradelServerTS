import ApplicationError from "Exceptions/ApplicationError";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";

export class UnauthenticatedError extends ApplicationError {
  constructor(description = "Not Authenticated") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.UNAUTHENTICATED,
      isOperational: undefined,
    });

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
