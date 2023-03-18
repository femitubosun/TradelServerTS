import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  MERCHANT_COLLECTION_RESOURCE,
  ERROR,
  NOT_APPLICABLE,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import CollectionService from "Api/Modules/Client/Inventory/Services/CollectionService";
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class FetchMerchantCollectionByIdentifierController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;

      const { collectionIdentifier } = request.params;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      const collection = await CollectionService.getCollectionByIdentifier(
        collectionIdentifier
      );

      if (collection === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(MERCHANT_COLLECTION_RESOURCE),
        });
      }

      if (collection.merchantId != merchant!.id) {
        return response.status(HttpStatusCodeEnum.FORBIDDEN).json({
          status_code: HttpStatusCodeEnum.FORBIDDEN,
          status: ERROR,
          message: "You are not authorized to access this resource",
        });
      }

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_FETCHED_SUCCESSFULLY(MERCHANT_COLLECTION_RESOURCE),
        results: {
          identifier: collection.identifier,
          label: collection.label,
          slug: collection.slug,
          image_url: collection.imageUrl || NOT_APPLICABLE,
          meta: {
            created_at: collection.createdAt,
            updated_at: collection.updatedAt,
          },
        },
      });
    } catch (FetchMerchantCollectionByIdentifierError) {
      console.log(
        "🚀 ~ FetchMerchantCollectionByIdentifier.handle FetchMerchantCollectionByIdentifierError ->",
        FetchMerchantCollectionByIdentifierError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new FetchMerchantCollectionByIdentifierController();
