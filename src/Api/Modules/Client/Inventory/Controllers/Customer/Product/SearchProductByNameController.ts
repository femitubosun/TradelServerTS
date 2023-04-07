import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  PRODUCT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";
import { RESOURCE_LIST_FETCHED_SUCCESSFULLY } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class SearchProductByNameController {
  public async handle(request: Request, response: Response) {
    try {
      const { search_query: searchQuery } = request.query;

      const products = await ProductService.searchProduct(String(searchQuery));

      const mutatedProducts = products.map((product) => product.forClient);

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_LIST_FETCHED_SUCCESSFULLY(PRODUCT_RESOURCE),
        results: mutatedProducts,
      });
    } catch (SearchProductByNameControllerError) {
      console.log(
        "🚀 ~ SearchProductByNameController.handle SearchProductByNameControllerError ->",
        SearchProductByNameControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new SearchProductByNameController();
