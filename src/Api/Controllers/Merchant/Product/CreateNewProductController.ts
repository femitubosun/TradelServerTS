import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Helpers/Messages/SystemMessages";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { container } from "tsyringe";
import ProductService from "Logic/Services/ProductService";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import MerchantService from "Logic/Services/MerchantService";

const dbContext = container.resolve(DbContext);

class CreateNewProductController {
  public async createNewProduct(request: Request, response: Response) {
    let statusCode = HttpStatusCodeEnum.CREATED;
    try {
      const user = (request as AuthRequest).user;

      const merchant = await MerchantService.getMerchantByUserId(user.id);

      const { name, description, base_price: basePrice } = request.body;

      const queryRunner = await dbContext.getTransactionalQueryRunner();

      await queryRunner.startTransaction();
      try {
        await ProductService.createProductRecord({
          name,
          description,
          basePrice,
          queryRunner,
          merchantId: merchant!.id,
        });

        await queryRunner.commitTransaction();

        return response.status(statusCode).json({
          status_code: statusCode,
          status: SUCCESS,
          message: "Product Created Successfully",
        });
      } catch (createNewProductControllerError) {
        console.log(
          "🚀 ~ CreateNewProductController.createNewProduct createNewProductControllerError ->",
          createNewProductControllerError
        );

        await queryRunner.rollbackTransaction();

        return response.status(statusCode).json({
          status_code: statusCode,
          status: ERROR,
          message: SOMETHING_WENT_WRONG,
        });
      }
    } catch (createNewProductControllerError) {
      statusCode = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;
      console.log(
        "🚀 ~ CreateNewProductController.createNewProduct createNewProductControllerError ->",
        createNewProductControllerError
      );

      return response.status(statusCode).json({
        status_code: statusCode,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new CreateNewProductController();
