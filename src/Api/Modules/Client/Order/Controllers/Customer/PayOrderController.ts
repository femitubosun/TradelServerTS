import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INSUFFICIENT_FUNDS_IN_WALLET,
  NOT_ENOUGH_STOCK,
  NULL_OBJECT,
  PAY_FOR_ORDER_OPERATION,
  PLEASE_ACTIVATE_ACCOUNT_TO_COMPLETE_ORDER,
  SUCCESS,
  YOU_HAVE_ALREADY_PAID_FOR_ORDER,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import {
  OPERATION_FAILURE,
  OPERATION_SUCCESS,
  RESOURCE_RECORD_NOT_FOUND,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import PurchaseOrderService from "Api/Modules/Client/Order/Services/PurchaseOrderService";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { CreateSalesOrderDto } from "Api/Modules/Client/Order/TypeChecking/SalesOrder/CreateSalesOrderDto";
import SalesOrderService from "Api/Modules/Client/Order/Services/SalesOrderService";
import { InventoryInternalApi } from "Api/Modules/Client/Inventory/InventoryInternalApi";
import { FinanceInternalApi } from "Api/Modules/Client/Finance/FinanceInternalApi";
import { OrderItemErrorsType } from "Api/Modules/Client/Order/TypeChecking/GeneralPurpose/OrderItemErrorsType";
import { Event } from "Api/Modules/Client/Order/Events";
import { OrderEventTypesEnum } from "Api/Modules/Client/Order/TypeChecking/GeneralPurpose/OrderEventTypesEnum";
import { OrderStatusEnum } from "Api/Modules/Client/Order/Entities/OrderStatusEnum";

const dbContext = container.resolve(DbContext);

class PayOrderController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const user = (request as AuthRequest).user;

      const customer = await ProfileInternalApi.getCustomerByUserId(user!.id);

      const { order_identifier: orderIdentifier } = request.body;

      const purchaseOrder =
        await PurchaseOrderService.getPurchaseOrderByIdentifier(
          orderIdentifier
        );

      if (
        purchaseOrder == NULL_OBJECT ||
        customer!.id != purchaseOrder.customerId
      ) {
        return response.status(HttpStatusCodeEnum.NOT_FOUND).json({
          status_code: HttpStatusCodeEnum.NOT_FOUND,
          status: ERROR,
          message: RESOURCE_RECORD_NOT_FOUND(PAY_FOR_ORDER_OPERATION),
        });
      }

      if (purchaseOrder.status === OrderStatusEnum.PROCESSED) {
        return response.status(HttpStatusCodeEnum.OK).json({
          status_code: HttpStatusCodeEnum.OK,
          status: SUCCESS,
          message: YOU_HAVE_ALREADY_PAID_FOR_ORDER,
        });
      }

      const wallet = await FinanceInternalApi.getWalletByUserId(user.id);

      if (wallet == NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: PLEASE_ACTIVATE_ACCOUNT_TO_COMPLETE_ORDER,
        });
      }

      if (wallet!.balance < purchaseOrder.cost) {
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: INSUFFICIENT_FUNDS_IN_WALLET,
        });
      }

      const orderErrors: OrderItemErrorsType[] = [];

      for (const item of purchaseOrder.items) {
        let merchantId;

        if (item.isProduct) {
          const product = await InventoryInternalApi.getProductById(
            item.productId
          );
          merchantId = product?.merchantId;

          if (product && item.quantity > product?.stock) {
            orderErrors.push({
              order_item: item.forClient,
              message: NOT_ENOUGH_STOCK,
            });
          }

          await InventoryInternalApi.depleteProduct({
            productId: item.productId,
            quantity: item.quantity,
            queryRunner,
          });
        }
        if (item.productVariantId) {
          const productVariant =
            await InventoryInternalApi.getProductVariantById(
              item.productVariantId
            );

          merchantId = productVariant?.product.merchantId;

          if (productVariant && item.quantity > productVariant?.stock) {
            orderErrors.push({
              order_item: item.forClient,
              message: NOT_ENOUGH_STOCK,
            });
          }

          await InventoryInternalApi.depleteProductVariant({
            productVariantId: item.productVariantId,
            queryRunner,
            quantity: item.quantity,
          });
        }

        const createSalesOrderDto: CreateSalesOrderDto = {
          customerId: customer!.id,
          merchantId: Number(merchantId),
          purchaseOrder: purchaseOrder,
          quantity: item.quantity,
          productVariantId: item.productVariantId,
          productId: item.productId,
          cost: item.cost,
          queryRunner,
        };
        await SalesOrderService.createSalesOrderRecord(createSalesOrderDto);
      }

      if (orderErrors.length > 0) {
        await queryRunner.rollbackTransaction();

        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: OPERATION_FAILURE(PAY_FOR_ORDER_OPERATION),
          results: orderErrors,
        });
      }

      await queryRunner.commitTransaction();

      Event.emit(
        OrderEventTypesEnum.order.paymentForPurchaseOrder,
        purchaseOrder.id
      );

      return response.status(HttpStatusCodeEnum.OK).json({
        status_code: HttpStatusCodeEnum.OK,
        status: SUCCESS,
        message: OPERATION_SUCCESS(PAY_FOR_ORDER_OPERATION),
      });
    } catch (PayOrderControllerError) {
      console.log(
        "🚀 ~ PayOrderController.handle PayOrderControllerError ->",
        PayOrderControllerError
      );

      await queryRunner.rollbackTransaction();

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: OPERATION_FAILURE(PAY_FOR_ORDER_OPERATION),
      });
    }
  }
}

export default new PayOrderController();
