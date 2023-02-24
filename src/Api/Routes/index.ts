import { Request, Response, Router } from "express";
import authRoutes from "Api/Routes/Auth/AuthRoutes";
import onboardingRoutes from "Api/Routes/Onboarding/OnboardingRoutes";
import productRoutes from "Api/Routes/Customer/ProductRoutes";
import productCategoryRoutes from "Api/Routes/Customer/ProductCategoryRoutes";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import { SUCCESS, WELCOME_TO_API } from "Helpers/Messages/SystemMessages";

const routes = Router();

routes.use("", authRoutes);
routes.use("", onboardingRoutes);
routes.use("", productRoutes);
routes.use("", productCategoryRoutes);

routes.use("/", (request: Request, response: Response) => {
  response.status(HttpStatusCodeEnum.OK).json({
    status_code: HttpStatusCodeEnum.OK,
    status: SUCCESS,
    message: WELCOME_TO_API,
  });
});
export default routes;
