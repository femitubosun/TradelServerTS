import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  MERCHANT_RESOURCE,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import * as Http from "http";
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class FetchMerchantByIdentifierController {
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
          message: RESOURCE_RECORD_NOT_FOUND(MERCHANT_RESOURCE),
        });
      }
      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_FETCHED_SUCCESSFULLY(MERCHANT_RESOURCE),
        results: {
          identifier: merchant.identifier,
          store_name: merchant.storeName,
          store_name_slug: merchant.storeNameSlug,
          photo_url: merchant.photoUrl,
          meta: {
            created_at: merchant.createdAt,
            updated_at: merchant.updatedAt,
          },
        },
      });
    } catch (FetchMerchantByIdentifierControllerError) {
      console.log(
        "🚀 ~ FetchMerchantByIdentifierController.handle FetchMerchantByIdentifierControllerError ->",
        FetchMerchantByIdentifierControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new FetchMerchantByIdentifierController();
