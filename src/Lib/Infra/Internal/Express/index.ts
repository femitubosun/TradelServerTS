import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { expressConfig } from "AppConfig/expressConfig";
import { LoggingFactory, ILoggingDriver } from "Lib/Infra/Internal/Logging";
import "express-async-errors";
import routes from "Web/Routers";

import {
  DATABASE_CONNECTED,
  DATABASE_CONNECTION_ERROR,
  DATABASE_POPULATED,
  EXPRESS_BOOTSTRAPPED,
  EXPRESS_BOOTSTRAPPED_ERROR,
  MIDDLEWARE_ATTACHED,
  ROUTES_ATTACHED,
} from "Utils/Messages";
import { DBContext } from "Lib/Infra/Internal/DBContext";

export default class Express {
  app: express.Express;
  dbContext: DBContext;
  loggingProvider: ILoggingDriver;

  constructor(dbContext: any) {
    this.loggingProvider = LoggingFactory.build();
    this.dbContext = dbContext;
    this.#bootstrap();
  }

  #bootstrap() {
    this.app = express();
    Promise.resolve(this.#connectDatabase())
      .then(this.loggingProvider.info(EXPRESS_BOOTSTRAPPED))
      .catch((err) => {
        this.loggingProvider.error(EXPRESS_BOOTSTRAPPED_ERROR);
      });
    this.#attachMiddlewares();
    this.#attachRouters();
    // this.app.use((err: any, req: any, res: any, next: any) => {
    //   console.error(err.stack);
    //   res.status(500).send("Something broke!");
    // });
    this.app.use(this.clientErrorHandler);
  }

  #attachMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: Express.getCorsWhiteList() as any,
      })
    );
    this.loggingProvider.info(MIDDLEWARE_ATTACHED);
  }

  async #connectDatabase() {
    try {
      await this.dbContext.connect();
      this.loggingProvider.info(DATABASE_CONNECTED);
      // await this.dbContext.populateDB();
      // this.loggingProvider.info(DATABASE_POPULATED);
    } catch (e: any) {
      this.loggingProvider.info(DATABASE_CONNECTION_ERROR);
      this.loggingProvider.error(e.toString());
    }
  }

  #attachRouters() {
    this.loggingProvider.info(ROUTES_ATTACHED);

    this.app.use("/Interface", routes);
  }

  public static getCorsWhiteList(): Array<String> {
    return expressConfig.CORS_WHITELIST;
  }

  //TODO custom exceptions
  public clientErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    res.status(500).send({
      error: err.message,
      status: "error",
      status_code: 500,
      message: err.message,
    });
  }
}
