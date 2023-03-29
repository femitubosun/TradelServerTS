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
import { RESOURCE_RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";

class DeleteProductVariantController {
  public async handle(request: Request, response: Response) {
    try {
      const { productVariantIdentifier } = request.params;

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

      await ProductVariantService.deleteProductVariant(productVariant.id);

      return response.status(HttpStatusCodeEnum.NO_CONTENT).json({
        status_code: HttpStatusCodeEnum.NO_CONTENT,
        status: SUCCESS,
      });
    } catch (DeleteProductVariantControllerError) {
      console.log(
        "🚀 ~ DeleteProductVariantController.handle DeleteProductVariantControllerError ->",
        DeleteProductVariantControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new DeleteProductVariantController();
