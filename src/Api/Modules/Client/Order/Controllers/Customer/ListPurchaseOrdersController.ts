import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  PURCHASE_ORDER_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import PurchaseOrderService from "Api/Modules/Client/Order/Services/PurchaseOrderService";
import { RESOURCE_LIST_FETCHED_SUCCESSFULLY } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class ListPurchaseOrdersController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;

      const customer = await ProfileInternalApi.getCustomerByUserId(user.id);

      const purchaseOrders =
        await PurchaseOrderService.listPurchaseOrderByCustomerId(customer!.id);

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_LIST_FETCHED_SUCCESSFULLY(PURCHASE_ORDER_RESOURCE),
        results: purchaseOrders.map((order) => order.forClient),
      });
    } catch (ListPurchaseOrdersControllerError) {
      console.log(
        "🚀 ~ ListPurchaseOrdersController.handle ListPurchaseOrdersControllerError ->",
        ListPurchaseOrdersControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ListPurchaseOrdersController();
