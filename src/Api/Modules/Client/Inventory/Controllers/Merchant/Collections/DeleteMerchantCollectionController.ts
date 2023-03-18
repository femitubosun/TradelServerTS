import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  MERCHANT_COLLECTION_RESOURCE,
  ERROR,
  NULL_OBJECT,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import CollectionService from "Api/Modules/Client/Inventory/Services/CollectionService";
import { RESOURCE_RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

const dbContext = container.resolve(DbContext);

class DeleteMerchantCollectionController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
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
      await CollectionService.deleteCollection({
        identifier: collectionIdentifier,
        identifierType: "identifier",
        queryRunner,
      });

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.NO_CONTENT).json({
        status_code: HttpStatusCodeEnum.NO_CONTENT,
        status: SUCCESS,
      });
    } catch (DeleteMerchantCollectionControllerError) {
      console.log(
        "🚀 ~ DeleteMerchantCollectionController.handle DeleteMerchantCollectionControllerError ->",
        DeleteMerchantCollectionControllerError
      );
      await queryRunner.rollbackTransaction();
      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new DeleteMerchantCollectionController();
