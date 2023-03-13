import { Request, Response, Router } from "express";
// import productRoutes from "Api/Routes/Customer/ProductRoutes";
// import merchantRoutes from "Api/Routes/Merchant/ProductRoutes";
import OnboardingAndAuthenticationRoutes from "Api/Modules/Client/OnboardingAndAuthentication/Routes/index";
import InventoryRoutes from "Api/Modules/Client/Inventory/Routes/index";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  SUCCESS,
  WELCOME_TO_API,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";

const routes = Router();

routes.use("", OnboardingAndAuthenticationRoutes);
routes.use("", InventoryRoutes);

routes.use("/", (request: Request, response: Response) => {
  response.status(HttpStatusCodeEnum.OK).json({
    status_code: HttpStatusCodeEnum.OK,
    status: SUCCESS,
    message: WELCOME_TO_API,
  });
});
export default routes;
