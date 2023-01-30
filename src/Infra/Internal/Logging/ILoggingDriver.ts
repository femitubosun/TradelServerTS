export interface ILoggingDriver {
  info(data: any): any;

  error(data: any): any;
}
