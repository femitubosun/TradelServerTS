import Express from "Infra/Internal/Express";
import { expressConfig } from "Src/Config";
import { SERVER_STARTED } from "Src/Utils/Messages";

class Application {
  server: any;
  express: Express;

  constructor() {
    this.express = new Express();
    const port = expressConfig.PORT;
    this.server = this.express.app.listen(port, () => {
      console.clear();
      this.express.loggingProvider.info(`${SERVER_STARTED} PORT: ${port}`);
      this.express.loggingProvider.info(`HEALTH: ${port}/ping`);
    });
  }
}

export default Application;
