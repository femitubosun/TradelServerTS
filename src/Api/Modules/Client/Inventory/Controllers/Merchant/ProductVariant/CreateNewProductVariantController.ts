import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  PRODUCT_VARIANT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
  UNAUTHORIZED_OPERATION,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import {
  RESOURCE_RECORD_CREATED_SUCCESSFULLY,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import ProductVariantOptionsService from "Api/Modules/Client/Inventory/Services/ProductVariantOptionsService";
import * as console from "console";
import ProductVariantService from "Api/Modules/Client/Inventory/Services/ProductVariantService";

const dbContext = container.resolve(DbContext);

class CreateNewProductVariantController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const { productIdentifier } = request.params;
      const { parent_variants: parentVariants, sku, price } = request.body;

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

      const isNotMember = false;

      const variantParentIsMember =
        await ProductVariantOptionsService.isCombinationInVariantOption({
          identifier: productVariantOptions!.id,
          identifierType: "id",
          combination: parentVariants,
        });

      if (variantParentIsMember === isNotMember) {
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: "Invalid Variant Parents",
        });
      }

      const productVariant =
        await ProductVariantService.createProductVariantRecord({
          sku,
          parentVariants: parentVariants,
          queryRunner,
          price,
          productId: product.id,
        });

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.CREATED).json({
        status_code: HttpStatusCodeEnum.CREATED,
        status: SUCCESS,
        message: RESOURCE_RECORD_CREATED_SUCCESSFULLY(PRODUCT_VARIANT_RESOURCE),
        results: productVariant.forClient,
      });
    } catch (CreateNewProductVariantControllerError) {
      console.log(
        "🚀 ~ CreateNewProductVariantController.handle CreateNewProductVariantControllerError ->",
        CreateNewProductVariantControllerError
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

export default new CreateNewProductVariantController();
