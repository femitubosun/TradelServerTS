import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NOT_APPLICABLE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import CollectionService from "Api/Modules/Client/Inventory/Services/CollectionService";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class ListMerchantCollectionsController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      const collections =
        await CollectionService.listActiveCollectionsByMerchantId(merchant!.id);

      const mutatedCollections = collections.map((collection) => {
        return {
          identifier: collection.identifier,
          label: collection.label,
          slug: collection.slug,
          image_url: collection.imageUrl || NOT_APPLICABLE,
          meta: {
            created_at: collection.createdAt,
            updated_at: collection.updatedAt,
          },
        };
      });

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_FETCHED_SUCCESSFULLY(),
        results: mutatedCollections,
      });
    } catch (ListMerchantCollectionsControllerError) {
      console.log(
        "🚀 ~ ListMerchantCollectionsController.handle ListMerchantCollectionsControllerError ->",
        ListMerchantCollectionsControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ListMerchantCollectionsController();
