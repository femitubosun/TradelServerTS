import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "Utils/HttpStatusCodeEnum";
import {
  ERROR,
  INSUFFICIENT_FUNDS_IN_WALLET,
  NOT_ENOUGH_STOCK,
  NULL_OBJECT,
  PAY_FOR_ORDER_OPERATION,
  PLEASE_ACTIVATE_ACCOUNT_TO_COMPLETE_ORDER,
  PRODUCT_RESOURCE,
  PRODUCT_VARIANT_RESOURCE,
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
import { OrderStatusEnum } from "Api/Modules/Client/Order/Entities/OrderStatusEnum";
import { TransactionTypesEnum } from "Api/Modules/Client/Finance/TypeChecking/Transaction/TransactionTypesEnum";

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

      await FinanceInternalApi.chargeWallet({
        walletId: wallet.id,
        amount: purchaseOrder.cost,
        queryRunner,
      });

      await FinanceInternalApi.createTransactionDetailsRecord({
        queryRunner,
        wallet: wallet!,
        amount: purchaseOrder.cost,
        transactionDescription: `Purchase for ${purchaseOrder.identifier}`,
        transactionType: TransactionTypesEnum.WITHDRAWAL,
      });

      const orderErrors: OrderItemErrorsType[] = [];

      for (const item of purchaseOrder.items) {
        const ITEM_IS_A_PRODUCT = item.isProduct === true;

        const merchantId = ITEM_IS_A_PRODUCT
          ? (await InventoryInternalApi.getProductById(item.productId))
              ?.merchantId
          : (
              await InventoryInternalApi.getProductVariantById(
                item.productVariantId
              )
            )?.product.merchantId;

        const inventoryItem = ITEM_IS_A_PRODUCT
          ? await InventoryInternalApi.getProductById(item.productId)
          : await InventoryInternalApi.getProductVariantById(
              item.productVariantId
            );

        if (inventoryItem === NULL_OBJECT) {
          orderErrors.push({
            order_item: item.forClient,
            message: RESOURCE_RECORD_NOT_FOUND(
              ITEM_IS_A_PRODUCT ? PRODUCT_RESOURCE : PRODUCT_VARIANT_RESOURCE
            ),
          });

          continue;
        }

        if (inventoryItem!.stock < item.quantity) {
          orderErrors.push({
            order_item: item.forClient,
            message: NOT_ENOUGH_STOCK,
          });

          continue;
        }

        ITEM_IS_A_PRODUCT
          ? await InventoryInternalApi.depleteProduct({
              productId: item.productId,
              quantity: item.quantity,
              queryRunner,
            })
          : await InventoryInternalApi.depleteProductVariant({
              productVariantId: item.productVariantId,
              queryRunner,
              quantity: item.quantity,
            });

        const createSalesOrderDto: CreateSalesOrderDto = {
          customerId: customer!.id,
          merchantId: Number(merchantId),
          purchaseOrder: purchaseOrder,
          quantity: item.quantity,
          productVariantId: item.productVariantId,
          productId: item.productId,
          cost: item.cost,
          status: OrderStatusEnum.PROCESSED,
          queryRunner,
        };

        const salesOrder = await SalesOrderService.createSalesOrderRecord(
          createSalesOrderDto
        );

        const merchantUserId = await ProfileInternalApi.getMerchantUserId({
          identifier: Number(merchantId),
          identifierType: "id",
        });

        const merchantWallet = await FinanceInternalApi.getWalletByUserId(
          merchantUserId
        );

        const transactionDescription = `Purchase for ${salesOrder.identifier})`;

        // Handle this guy as an event.

        await FinanceInternalApi.createInternalTransactionRecord({
          amount: salesOrder.cost,
          sourceWalletId: wallet!.id,
          destinationWalletId: merchantWallet!.id,
          transactionDescription,
          queryRunner,
        });

        await FinanceInternalApi.fundWallet({
          amount: salesOrder.cost,
          walletId: merchantWallet!.id,
          queryRunner,
        });

        await FinanceInternalApi.createTransactionDetailsRecord({
          queryRunner,
          wallet: merchantWallet!,
          amount: salesOrder.cost,
          transactionType: TransactionTypesEnum.DEPOSIT,
          transactionDescription,
        });
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

      await PurchaseOrderService.updatePurchaseOrderRecord({
        identifier: purchaseOrder.id,
        identifierType: "id",
        updatePayload: {
          status: OrderStatusEnum.PROCESSED,
        },
        queryRunner,
        useTransaction: true,
      });

      await queryRunner.commitTransaction();

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
