import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import ProductVariantOptionsService from "Api/Modules/Client/Inventory/Services/ProductVariantOptionsService";

class FetchProductByIdentifierController {
  public async handle(request: Request, response: Response) {
    try {
      const { productIdentifier } = request.params;

      const product = await ProductService.getProductByIdentifier(
        productIdentifier
      );

      if (product === NULL_OBJECT || !product.isActive) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_RESOURCE),
        });
      }

      const merchant = await ProfileInternalApi.getMerchantById(
        product.merchantId
      );

      const productVariantOptions =
        await ProductVariantOptionsService.getProductVariantOptionsByProductId(
          product.id
        );

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_FETCHED_SUCCESSFULLY(PRODUCT_RESOURCE),
        results: {
          identifier: product.identifier,
          name: product.name,
          name_slug: product.nameSlug,
          description: product.description,
          base_price: product.basePrice,
          meta: {
            variants: productVariantOptions,
            merchant: {
              identifier: merchant?.identifier,
              store_name: merchant?.storeName,
              store_name_slug: merchant?.storeNameSlug,
            },
            created_at: product.createdAt,
            updated_at: product.updatedAt,
          },
        },
      });
    } catch (FetchProductByIdentifierControllerError) {
      console.log(
        "🚀 ~ FetchProductByIdentifierController.handle FetchProductByIdentifierControllerError ->",
        FetchProductByIdentifierControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new FetchProductByIdentifierController();
