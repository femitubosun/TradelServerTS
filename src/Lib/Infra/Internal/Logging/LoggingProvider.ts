import { ILoggingDriver } from "Lib/Infra/Internal/Logging/ILoggingDriver";

export class LoggingProvider {
  constructor(private driver: ILoggingDriver) {}

  public info(str: any) {
    return this.driver.info(str);
  }

  public error(err: any) {
    return this.driver.error(err);
  }
}
