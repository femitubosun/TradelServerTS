import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  PRODUCT_VARIANT_OPTION_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import {
  RESOURCE_RECORD_NOT_FOUND,
  RESOURCE_RECORD_UPDATED_SUCCESSFULLY,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import ProductVariantOptionsService from "Api/Modules/Client/Inventory/Services/ProductVariantOptionsService";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";

const dbContext = container.resolve(DbContext);

class RemoveProductVariantOptionController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const user = (request as AuthRequest).user;

      const { productIdentifier } = request.params;

      const { variant_label: variantLabel } = request.body;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      const product = await ProductService.getProductByIdentifier(
        productIdentifier
      );

      if (product === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_RESOURCE),
        });
      }

      if (product.merchantId != merchant!.id) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_RESOURCE),
        });
      }

      const productVariantOptions =
        await ProductVariantOptionsService.getProductVariantOptionsByProductId(
          product.id
        );

      let variantOptions = productVariantOptions!.variantOptions;

      variantOptions = variantOptions!.filter((el) => el.label != variantLabel);

      const updatedProductVariantOptions =
        await ProductVariantOptionsService.updateProductVariantOptionsRecord({
          identifier: productVariantOptions!.id!,
          identifierType: "id",
          updatePayload: {
            variantOptions,
          },
          queryRunner,
        });

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_RECORD_UPDATED_SUCCESSFULLY(
          PRODUCT_VARIANT_OPTION_RESOURCE
        ),
        results: updatedProductVariantOptions!.forClient,
      });
    } catch (DeleteProductVariantOptionsControllerError) {
      console.log(
        "🚀 ~ RemoveProductVariantOptionController.handle DeleteProductVariantOptionsControllerError ->",
        DeleteProductVariantOptionsControllerError
      );

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new RemoveProductVariantOptionController();
