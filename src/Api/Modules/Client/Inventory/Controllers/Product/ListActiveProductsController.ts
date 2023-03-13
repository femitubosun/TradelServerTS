import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INFORMATION_RETRIEVED,
  NOT_APPLICABLE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";

class ListActiveProductsController {
  public async handle(request: Request, response: Response) {
    try {
      const products = await ProductService.listActiveProducts();

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
    } catch (ListActiveProductsControllerError) {
      console.log(
        "🚀 ~ ListActiveProductsController.handle ListActiveProductsControllerError ->",
        ListActiveProductsControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ListActiveProductsController();
