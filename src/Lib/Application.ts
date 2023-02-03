import Express from "Lib/Infra/Internal/Express";
import { DBContext } from "Lib/Infra/Internal/DBContext";
import { expressConfig } from "AppConfig/expressConfig";
import { SERVER_STARTED } from "Utils/Messages";
import { DependencyContainer } from "tsyringe";
import { AppDataSource } from "Lib/Infra/Internal/DBContext/DataSource";

class Application {
  server: any;
  express: Express;
  container: DependencyContainer;

  constructor(container: DependencyContainer) {
    console.clear();
    this.container = container;
    const dbContext: DBContext = this.container.resolve(DBContext);
    this.express = new Express(dbContext);
    const port = expressConfig.PORT;
    this.server = this.express.app.listen(port, () => {
      this.express.loggingProvider.info(`${SERVER_STARTED} PORT: ${port}`);
      this.express.loggingProvider.info(`HEALTH: ${port}/ping`);
    });
  }
}

export default Application;
