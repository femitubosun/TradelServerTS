import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INFORMATION_CREATED,
  NOT_APPLICABLE,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  UNAUTHORIZED_OPERATION,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";

const dbContext = container.resolve(DbContext);

class CreateNewProductController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      if (merchant === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.UNAUTHORIZED).json({
          status_code: HttpStatusCodeEnum.UNAUTHORIZED,
          status: ERROR,
          message: UNAUTHORIZED_OPERATION,
        });
      }

      const { name, description, base_price: basePrice } = request.body;

      const queryRunner = await dbContext.getTransactionalQueryRunner();

      await queryRunner.startTransaction();

      // TODO Create Variants Record
      try {
        const product = await ProductService.createProductRecord({
          merchantId: merchant!.id,
          name,
          description,
          basePrice,
          queryRunner,
        });

        await queryRunner.commitTransaction();

        return response.status(HttpStatusCodeEnum.OK).json({
          status_code: HttpStatusCodeEnum.OK,
          status: SUCCESS,
          message: INFORMATION_CREATED,
          results: {
            name: product.name,
            name_slug: product.nameSlug,
            description: product.description || NOT_APPLICABLE,
            base_price: product.basePrice,
            meta: {
              created_at: product.createdAt,
              updated_at: product.updatedAt,
            },
          },
        });
      } catch (CreateNewProductControllerError) {
        console.log(
          "🚀 ~ CreateNewProductController.handle CreateNewProductControllerError ->",
          CreateNewProductControllerError
        );
        await queryRunner.rollbackTransaction();

        return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: SOMETHING_WENT_WRONG,
        });
      }
    } catch (CreateNewProductControllerError) {
      console.log(
        "🚀 ~ CreateNewProductController.handle CreateNewProductControllerError ->",
        CreateNewProductControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new CreateNewProductController();
