import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INFORMATION_RETRIEVED,
  MERCHANT_RESOURCE,
  NOT_APPLICABLE,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import { RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class ListActiveProductsByMerchantController {
  public async handle(request: Request, response: Response) {
    try {
      const { merchantIdentifier } = request.params;

      const merchant = await ProfileInternalApi.getMerchantByIdentifier(
        merchantIdentifier
      );

      if (merchant === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RECORD_NOT_FOUND(MERCHANT_RESOURCE),
        });
      }

      const products = await ProductService.listActiveProductsByMerchantId(
        merchant!.id
      );

      const mutatedProducts = products.map((product) => {
        return {
          identifier: product.identifier,
          name: product.name,
          name_slug: product.nameSlug,
          description: product.description || NOT_APPLICABLE,
          base_price: product.basePrice,
          meta: {
            created_at: product.createdAt,
            updated_at: product.updatedAt,
          },
        };
      });

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: INFORMATION_RETRIEVED,
        results: mutatedProducts,
      });
    } catch (ListActiveProductsByMerchantControllerError) {
      console.log(
        "🚀 ~ ListActiveProductsByMerchantController.handle ListActiveProductsByMerchantControllerError ->",
        ListActiveProductsByMerchantControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ListActiveProductsByMerchantController();
