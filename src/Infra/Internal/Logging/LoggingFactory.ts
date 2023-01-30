import { WinstonDriver } from "./WinstonDriver";
import { LoggingProvider } from "./LoggingProvider";
import { PROVIDER_NOT_FOUND } from "Src/Utils/Messages";
import { loggingConfig } from "Src/Config";

export default class LoggingFactory {
  public static build() {
    if (LoggingFactory.getCurrentProvider() === "winston") {
      return new LoggingProvider(new WinstonDriver());
    } else {
      throw new Error(PROVIDER_NOT_FOUND);
    }
  }

  public static getCurrentProvider() {
    return loggingConfig.LOGGING_PROVIDER;
  }
}
