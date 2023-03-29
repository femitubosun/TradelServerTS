import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PRODUCT_VARIANT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import ProductVariantService from "Api/Modules/Client/Inventory/Services/ProductVariantService";
import {
  RESOURCE_RECORD_NOT_FOUND,
  RESOURCE_RECORD_UPDATED_SUCCESSFULLY,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";

const dbContext = container.resolve(DbContext);

class UpdateProductVariantController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const { productVariantIdentifier } = request.params;

      const { sku, parent_variants: parentVariants, price } = request.body;

      const user = (request as AuthRequest).user;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      const productVariant =
        await ProductVariantService.getProductVariantByIdentifier(
          productVariantIdentifier
        );

      if (productVariant === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_VARIANT_RESOURCE),
        });
      }

      const product = await ProductService.getProductById(
        productVariant.productId
      );

      if (product === NULL_OBJECT) {
        await ProductVariantService.deleteProductVariant(productVariant.id);

        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_VARIANT_RESOURCE),
        });
      }

      if (product.merchantId != merchant!.id) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_VARIANT_RESOURCE),
        });
      }

      const updatedProductVariant =
        await ProductVariantService.updateProductVariant({
          identifier: productVariant.id,
          identifierType: "id",
          updatePayload: {
            sku: sku || productVariant.sku,
            price: price || productVariant.price,
            parentVariants: parentVariants || productVariant.parentVariants,
          },
          queryRunner,
        });

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_RECORD_UPDATED_SUCCESSFULLY(PRODUCT_VARIANT_RESOURCE),
        results: updatedProductVariant!.forMerchantClient,
      });
    } catch (UpdateProductVariantControllerError) {
      console.log(
        "🚀 ~ UpdateProductVariantController.handle UpdateProductVariantControllerError ->",
        UpdateProductVariantControllerError
      );

      await queryRunner.rollbackTransaction();

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new UpdateProductVariantController();
