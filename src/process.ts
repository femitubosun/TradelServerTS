import { errorHandler } from "Exceptions/ErrorHandler";

process.on("uncaughtException", (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`);
  errorHandler.handleError(error);
});
