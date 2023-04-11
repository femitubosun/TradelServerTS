import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  MERCHANT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import MerchantService from "Api/Modules/Client/Profile/Services/MerchantService";
import { RESOURCE_LIST_FETCHED_SUCCESSFULLY } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class SearchMerchantByNameController {
  public async handle(request: Request, response: Response) {
    try {
      const { search_query: searchQuery } = request.query;

      const merchants = await MerchantService.searchMerchant(
        String(searchQuery)
      );

      const mutatedMerchants = merchants.map((merchant) => merchant.forClient);

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_LIST_FETCHED_SUCCESSFULLY(MERCHANT_RESOURCE),
        results: mutatedMerchants,
      });
    } catch (SearchMerchantByNameControllerError) {
      console.log(
        "🚀 ~ SearchMerchantByNameController.handle SearchMerchantByNameControllerError ->",
        SearchMerchantByNameControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new SearchMerchantByNameController();
