import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  MERCHANT_COLLECTION_RESOURCE,
  NOT_APPLICABLE,
  NULL_OBJECT,
  PRODUCT_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import CollectionService from "Api/Modules/Client/Inventory/Services/CollectionService";
import { RESOURCE_RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import ProductService from "Api/Modules/Client/Inventory/Services/ProductService";

const dbContext = container.resolve(DbContext);

class RemoveProductFromMerchantCollectionController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const user = (request as AuthRequest).user;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      const { collectionIdentifier } = request.params;

      const { product_identifier: productIdentifier } = request.body;

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

      const product = await ProductService.getProductByIdentifier(
        productIdentifier
      );

      if (product === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PRODUCT_RESOURCE),
        });
      }

      if (product.merchantId !== merchant!.id) {
        return response.status(HttpStatusCodeEnum.FORBIDDEN).json({
          status_code: HttpStatusCodeEnum.FORBIDDEN,
          status: ERROR,
          message: "You are not authorized to perform this operation",
        });
      }

      let collectionItems = collection.items;

      collectionItems = collectionItems?.filter(
        (item) => item.id != product.id
      );

      const updatedCollection = await CollectionService.updateCollection({
        identifierType: "id",
        identifier: collection.id,
        updatePayload: {
          items: collectionItems,
        },
        queryRunner,
      });

      await queryRunner.commitTransaction();

      const mutatedItems = collectionItems.map((el) => el.forClient);

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: "Product Removed from collection Successfully",
        results: {
          identifier: updatedCollection!.identifier,
          label: updatedCollection!.label,
          slug: updatedCollection!.slug,
          image_url: updatedCollection!.imageUrl || NOT_APPLICABLE,
          collection_items: {
            items: mutatedItems,
            count: mutatedItems.length,
          },
          meta: {
            created_at: updatedCollection!.createdAt,
            updated_at: updatedCollection!.updatedAt,
          },
        },
      });
    } catch (RemoveItemFromMerchantCollectionControllerError) {
      console.log(
        "🚀 ~ RemoveItemFromMerchantCollectionController.handle RemoveItemFromMerchantCollectionControllerError ->",
        RemoveItemFromMerchantCollectionControllerError
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

export default new RemoveProductFromMerchantCollectionController();
