import ApplicationError from "Api/Modules/Common/Exceptions/ApplicationError";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";

export class UnauthenticatedError extends ApplicationError {
  constructor(description = "Not Authenticated") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.UNAUTHORIZED,
      isOperational: undefined,
    });

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
