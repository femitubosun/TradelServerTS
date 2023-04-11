import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";

class ListActiveMerchantsController {
  public async handle(request: Request, response: Response) {
    try {
      const merchants = await ProfileInternalApi.listActiveMerchants();

      const mutatedMerchants = merchants.map((merchant) => {
        return {
          identifier: merchant.identifier,
          store_name: merchant.storeName,
          store_name_slug: merchant.storeNameSlug,
          photo_url: merchant.photoUrl,
          meta: {
            created_at: merchant.createdAt,
            updated_at: merchant.updatedAt,
          },
        };
      });

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: "Merchant Records Fetched Successfully",
        results: mutatedMerchants,
      });
    } catch (ListActiveMerchantsControllerError) {
      console.log(
        "🚀 ~ ListActiveMerchantsController.handle ListActiveMerchantsControllerError ->",
        ListActiveMerchantsControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ListActiveMerchantsController();
