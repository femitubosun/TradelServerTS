import ApplicationError from "./ApplicationError";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";

export class UnauthorizedError extends ApplicationError {
  constructor(description = "Unauthorized") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.UNAUTHORIZED,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
