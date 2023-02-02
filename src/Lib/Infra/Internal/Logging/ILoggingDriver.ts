export interface ILoggingDriver {
  info(msg: string): any;

  error(msg: string): any;
}
