import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  PRODUCT_VARIANT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import ProductVariantService from "Api/Modules/Client/Inventory/Services/ProductVariantService";

class ListProductVariantsByProductController {
  public async handle(request: Request, response: Response) {
    try {
      const { productIdentifier } = request.params;

      const product = await ProductService.getProductByIdentifier(
        productIdentifier
      );

      if (product === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: SUCCESS,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_RESOURCE),
        });
      }

      const productVariants =
        await ProductVariantService.listProductVariantsByProductId(product.id);

      const mutatedProductVariants = productVariants.map(
        (productVariant) => productVariant.forCustomerClient
      );

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_FETCHED_SUCCESSFULLY(PRODUCT_VARIANT_RESOURCE),
        results: mutatedProductVariants,
      });
    } catch (ListProductVariantsByProductControllerError) {
      console.log(
        "🚀 ~ ListProductVariantsByProductController.handle ListProductVariantsByProductControllerError ->",
        ListProductVariantsByProductControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ListProductVariantsByProductController();
