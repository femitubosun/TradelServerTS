import ApplicationError from "./ApplicationError";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";

export class InternalServerError extends ApplicationError {
  constructor(description: string = "Internal Server Error") {
    super({
      description,
      httpStatusCode: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
      isOperational: undefined,
    });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
