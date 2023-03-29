import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  COLLECTION_WITH_LABEL_ALREADY_EXISTS,
  ERROR,
  MERCHANT_COLLECTION_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import CollectionService from "Api/Modules/Client/Inventory/Services/CollectionService";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

const dbContext = container.resolve(DbContext);

class CreateMerchantCollectionController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const user = (request as AuthRequest).user;

      const { label } = request.body;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      const existingCollection =
        await CollectionService.getMerchantCollectionByCollectionLabel({
          label,
          merchantId: merchant!.id,
        });

      if (existingCollection) {
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: COLLECTION_WITH_LABEL_ALREADY_EXISTS,
        });
      }

      const collection = await CollectionService.createCollectionRecord({
        label,
        merchantId: merchant!.id,
        queryRunner,
        items: [],
      });

      await queryRunner.commitTransaction();

      return response.status(HttpStatusCodeEnum.CREATED).json({
        status_code: HttpStatusCodeEnum.CREATED,
        status: SUCCESS,
        message: RESOURCE_RECORD_CREATED_SUCCESSFULLY(
          MERCHANT_COLLECTION_RESOURCE
        ),

        result: {
          ...collection.forClient,
          collection_items: { items: [], count: 0 },
        },
      });
    } catch (CreateMerchantCollectionControllerError) {
      console.log(
        "🚀 ~ CreateMerchantCollectionController.handle CreateMerchantCollectionControllerError ->",
        CreateMerchantCollectionControllerError
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

export default new CreateMerchantCollectionController();
