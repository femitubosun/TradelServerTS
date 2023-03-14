import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INFORMATION_RETRIEVED,
  NOT_APPLICABLE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";

class ListMerchantProductsController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      const products = await ProductService.listProductsByMerchantId(
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
    } catch (ListMerchantProductsControllerError) {
      console.log(
        "🚀 ~ ListMerchantProductsController.handle ListMerchantProductsControllerError ->",
        ListMerchantProductsControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ListMerchantProductsController();
