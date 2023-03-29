import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  CREATE_ORDER_FROM_CART_OPERATION,
  ERROR,
  NOT_ENOUGH_STOCK,
  NULL_OBJECT,
  SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { AuthRequest } from "TypeChecking/GeneralPurpose/AuthRequest";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import { InventoryInternalApi } from "Api/Modules/Client/Inventory/InventoryInternalApi";
import PurchaseOrderService from "Api/Modules/Client/Order/Services/PurchaseOrderService";
import OrderItemService from "Api/Modules/Client/Order/Services/PurchaseOrderItemService";
import {
  OPERATION_FAILURE,
  OPERATION_SUCCESS,
} from "Api/Modules/Common/Helpers/Messages/SystemMessageFunctions";
import { OrderEventTypesEnum } from "Api/Modules/Client/Order/TypeChecking/GeneralPurpose/OrderEventTypesEnum";
import { Event } from "Api/Modules/Client/Order/Events";
import { CartItemErrorsType } from "Api/Modules/Client/Order/TypeChecking/GeneralPurpose/CartItemErrorsType";

const dbContext = container.resolve(DbContext);

class CreateNewOrderController {
  public async handle(request: Request, response: Response) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const user = (request as AuthRequest).user;

      const customer = await ProfileInternalApi.getCustomerByUserId(user.id);

      const cart = await InventoryInternalApi.getCartByCustomerId(customer!.id);

      const order = await PurchaseOrderService.createPurchaseOrderRecord({
        queryRunner,
        customerId: customer!.id,
        items: [],
      });

      const mutatedOrderItems: object[] = [];
      const orderErrors: CartItemErrorsType[] = [];

      for (const item of cart!.items) {
        if (item.isProduct) {
          const product = await InventoryInternalApi.getProductById(
            item.productId
          );

          if (product === NULL_OBJECT) continue;

          if (product.stock < item.quantity) {
            orderErrors.push({
              cart_item: item.forClient,
              message: "NOT ENOUGH STOCK",
            });

            continue;
          }

          const orderItem =
            await OrderItemService.createPurchaseOrderItemRecord({
              order,
              productId: item.productId,
              isProduct: item.isProduct,
              quantity: item.quantity,
              cost: product.basePrice * item.quantity,
              queryRunner,
            });

          mutatedOrderItems.push({
            ...orderItem.forClient,
            product: product.forClient,
          });

          continue;
        }

        const productVariant = await InventoryInternalApi.getProductVariantById(
          item.productVariantId
        );

        if (productVariant === NULL_OBJECT) continue;

        if (productVariant.stock < item.quantity) {
          orderErrors.push({
            cart_item: item.forClient,
            message: NOT_ENOUGH_STOCK,
          });
          continue;
        }

        const orderItem = await OrderItemService.createPurchaseOrderItemRecord({
          order,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          isProduct: item.isProduct,
          cost: productVariant.price * item.quantity,
          queryRunner,
        });

        mutatedOrderItems.push({
          ...orderItem.forClient,
          product_variant: productVariant.forCustomerClient,
        });
      }

      if (orderErrors.length > 0) {
        return response.status(HttpStatusCodeEnum.BAD_REQUEST).json({
          status_code: HttpStatusCodeEnum.BAD_REQUEST,
          status: ERROR,
          message: OPERATION_FAILURE(CREATE_ORDER_FROM_CART_OPERATION),
          results: orderErrors,
        });
      }

      await queryRunner.commitTransaction();

      const newOrder = await PurchaseOrderService.getPurchaseOrderById(
        order.id
      );

      if (newOrder === NULL_OBJECT) {
        return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
          status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
          status: ERROR,
          message: OPERATION_FAILURE(CREATE_ORDER_FROM_CART_OPERATION),
        });
      }

      Event.emit(OrderEventTypesEnum.order.createPurchaseOrder, newOrder.id);

      return response.status(HttpStatusCodeEnum.CREATED).json({
        status_code: HttpStatusCodeEnum.CREATED,
        status: SUCCESS,
        message: OPERATION_SUCCESS(CREATE_ORDER_FROM_CART_OPERATION),
        results: {
          ...newOrder.forClient,
          items: mutatedOrderItems,
        },
      });
    } catch (CreateNewOrderControllerError) {
      console.log(
        "🚀 ~ CreateNewOrderController.handle CreateNewOrderControllerError ->",
        CreateNewOrderControllerError
      );

      await queryRunner.rollbackTransaction();

      return response.status(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatusCodeEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: OPERATION_FAILURE(CREATE_ORDER_FROM_CART_OPERATION),
      });
    }
  }
}

export default new CreateNewOrderController();
