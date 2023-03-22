import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NOT_APPLICABLE,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  PRODUCT_VARIANT_OPTION_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  UNAUTHORIZED_OPERATION,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import {
  RESOURCE_RECORD_CREATED_SUCCESSFULLY,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import { ProductVariantOptions } from "Api/Modules/Client/Inventory/Entities";
import ProductVariantOptionsService from "Api/Modules/Client/Inventory/Services/ProductVariantOptionsService";

const dbContext = container.resolve(DbContext);

class CreateProductVariantOptionController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const { productIdentifier } = request.params;

      const { variant_label: variant_label, variant_options: variantOptions } =
        request.body;

      const user = (request as AuthRequest).user;
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

      if (product.merchantId !== merchant!.id) {
        return response.status(HttpStatusCodeEnum.FORBIDDEN).json({
          status_code: HttpStatusCodeEnum.FORBIDDEN,
          status: ERROR,
          message: UNAUTHORIZED_OPERATION,
        });
      }

      const productVariantOptions =
        await ProductVariantOptionsService.getProductVariantOptionsByProductId(
          product.id
        );

      let variantOptionsArray = productVariantOptions!.variantOptions;

      if (
        variantOptionsArray!.find(
          (variantOption) => variantOption.label === variant_label
        )
      ) {
        variantOptionsArray = variantOptionsArray!.filter(
          (variantOption) => variantOption.label != variant_label
        );
      }

      variantOptionsArray!.push({
        label: variant_label,
        options: variantOptions,
      });

      const productVariant =
        await ProductVariantOptionsService.updateProductVariantOptionsRecord({
          identifier: productVariantOptions!.id,
          identifierType: "id",
          updatePayload: {
            variantOptions: variantOptionsArray!,
          },
          queryRunner,
        });

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.CREATED).json({
        status_code: HttpStatusCodeEnum.CREATED,
        status: SUCCESS,
        message: RESOURCE_RECORD_CREATED_SUCCESSFULLY(
          PRODUCT_VARIANT_OPTION_RESOURCE
        ),
        results: productVariant!.forClient,
      });
    } catch (CreateProductVariantOptionControllerError) {
      console.log(
        "🚀 ~ CreateProductVariantOptionController.handle CreateProductVariantOptionControllerError ->",
        CreateProductVariantOptionControllerError
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

export default new CreateProductVariantOptionController();
