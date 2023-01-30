import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { expressConfig } from "Src/Config";
import LoggingFactory from "../Logging/LoggingFactory";
// import routes from "Routes/index";
import { ILoggingDriver } from "Infra/Internal/Logging/ILoggingDriver";
import { DATABASE_CONNECTED } from "Src/Utils/Messages";

export default class Express {
  app: express.Express;
  databaseSource: any;
  loggingProvider: ILoggingDriver;

  constructor() {
    this.loggingProvider = LoggingFactory.build();
    this.#bootstrap();
  }

  #bootstrap() {
    this.app = express();
    this.#attachMiddlewares();
    // this.#attachRouters();
  }

  async #attachMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(this.#clientErrorHandler);
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: Express.getCorsWhiteList() as any,
      })
    );
    this.loggingProvider.info("MIDDLEWARE ATTACHED");
  }

  async #connectDatabase() {
    this.loggingProvider.info(DATABASE_CONNECTED);
  }

  // async #attachRouters() {
  //   this.loggingProvider.info("ROUTERS ATTACHED");
  //   this.app.use("/Interface", routes);
  // }

  public static getCorsWhiteList(): Array<String> {
    return expressConfig.CORS_WHITELIST;
  }

  #clientErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err.hasOwnProperty("thrown")) {
      res.status(err["status"].send({ error: err.message }));
    }
  }
}
