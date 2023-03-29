import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  NULL_OBJECT,
  PURCHASE_ORDER_RESOURCE,
  SOMETHING_WENT_WRONG,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import PurchaseOrderService from "Api/Modules/Client/Order/Services/PurchaseOrderService";
import { RESOURCE_RECORD_NOT_FOUND } from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";

class DeletePurchaseOrderController {
  public async handle(request: Request, response: Response) {
    try {
      const user = (request as AuthRequest).user;

      const { purchaseOrderIdentifier } = request.params;

      const customer = await ProfileInternalApi.getCustomerByUserId(user.id);

      const purchaseOrder =
        await PurchaseOrderService.getPurchaseOrderByIdentifier(
          purchaseOrderIdentifier
        );

      if (purchaseOrder === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PURCHASE_ORDER_RESOURCE),
        });
      }

      if (purchaseOrder.customerId !== customer!.id) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PURCHASE_ORDER_RESOURCE),
        });
      }

      await PurchaseOrderService.deletePurchaseOrder(purchaseOrder.id);

      return response.status(HttpStatusCodeEnum.NO_CONTENT).json({
        status_code: HttpStatusCodeEnum.NO_CONTENT,
        status: SUCCESS,
      });
    } catch (DeleteOrderControllerError) {
      console.log(
        "🚀 ~ DeleteOrderController.handle DeleteOrderControllerError ->",
        DeleteOrderControllerError
      );

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default new DeletePurchaseOrderController();
