import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PRODUCT_VARIANT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ProductVariantService from "Api/Modules/Client/Inventory/Services/ProductVariantService";
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class FetchProductVariantByIdentifierController {
  public async handle(request: Request, response: Response) {
    try {
      const { productVariantIdentifier } = request.params;

      const productVariant =
        await ProductVariantService.getProductVariantByIdentifier(
          productVariantIdentifier
        );

      if (productVariant === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: SUCCESS,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_VARIANT_RESOURCE),
        });
      }

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_FETCHED_SUCCESSFULLY(PRODUCT_VARIANT_RESOURCE),
        results: productVariant.forCustomerClient,
      });
    } catch (FetchProductVariantByIdentifierControllerError) {
      console.log(
        "🚀 ~ FetchProductVariantByIdentifierController.handle FetchProductVariantByIdentifierControllerError ->",
        FetchProductVariantByIdentifierControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new FetchProductVariantByIdentifierController();
