import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  SALES_ORDER_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import SalesOrderService from "Api/Modules/Client/Order/Services/SalesOrderService";
import {
  RESOURCE_FETCHED_SUCCESSFULLY,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import { InventoryInternalApi } from "Api/Modules/Client/Inventory/InventoryInternalApi";

class FetchSaleOrderByIdentifierController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user!.id);

      const { salesOrderIdentifier } = request.params;

      const salesOrder = await SalesOrderService.getSalesOrderByIdentifier(
        salesOrderIdentifier
      );

      if (salesOrder === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(SALES_ORDER_RESOURCE),
        });
      }

      if (salesOrder.merchantId != merchant!.id) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: SUCCESS,
          message: RESOURCE_RECORD_NOT_FOUND(SALES_ORDER_RESOURCE),
        });
      }

      if (salesOrder.isProduct) {
        const product = await InventoryInternalApi.getProductById(
          salesOrder.productId
        );

        return response.status(HttpStatusCodeEnum.OK).json({
          status_code: HttpStatusCodeEnum.OK,
          status: SUCCESS,
          message: RESOURCE_FETCHED_SUCCESSFULLY(SALES_ORDER_RESOURCE),
          results: {
            ...salesOrder.forClient,
            product: {
              ...product?.forClient,
            },
          },
        });
      }

      const productVariant = await InventoryInternalApi.getProductVariantById(
        salesOrder.productVariantId
      );

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_FETCHED_SUCCESSFULLY(SALES_ORDER_RESOURCE),
        results: {
          ...salesOrder.forClient,
          product: {
            ...productVariant?.forMerchantClient,
          },
        },
      });
    } catch (FetchSaleOrderByIdentifierControllerError) {
      console.log(
        "🚀 ~ FetchSaleOrderByIdentifierController.handle FetchSaleOrderByIdentifierControllerError ->",
        FetchSaleOrderByIdentifierControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new FetchSaleOrderByIdentifierController();
