import dotenv from "dotenv";
import { InternalServerError } from "Exceptions/InternalServerError";
import { ENV_NOT_FOUND } from "Helpers/Messages/SystemMessages";
import path from "path";

const envFound = dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

if (envFound.error) throw new InternalServerError(ENV_NOT_FOUND);

export * from "./businessConfig";
export * from "./expressConfig";
export * from "./loggingConfig";
export * from "./dbConfig";
export * from "./encryptionConfig";
export * from "./jwtConfig";
export * from "./emailConfig";
