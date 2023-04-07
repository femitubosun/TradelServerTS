import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  SALES_ORDER_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { RESOURCE_LIST_FETCHED_SUCCESSFULLY } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import SalesOrderService from "Api/Modules/Client/Order/Services/SalesOrderService";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";

class ListSaleOrderController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;

      const merchant = await ProfileInternalApi.getMerchantByUserId(user.id);

      const salesOrder = await SalesOrderService.listSalesOrderByMerchantId(
        merchant!.id
      );

      const mutatedSalesOrder = salesOrder.map((order) => order.forClient);

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: RESOURCE_LIST_FETCHED_SUCCESSFULLY(SALES_ORDER_RESOURCE),
        results: mutatedSalesOrder,
      });
    } catch (ListSaleOrderControllerError) {
      console.log(
        "🚀 ~ ListSaleOrderController.handle ListSaleOrderControllerError ->",
        ListSaleOrderControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new ListSaleOrderController();
