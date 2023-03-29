import PurchaseOrderService from "Api/Modules/Client/Order/Services/PurchaseOrderService";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { sum } from "lodash";
import SalesOrderService from "Api/Modules/Client/Order/Services/SalesOrderService";
import { ProfileInternalApi } from "Api/Modules/Client/Profile/ProfileInternalApi";
import { FinanceInternalApi } from "Api/Modules/Client/Finance/FinanceInternalApi";
import { TransactionTypesEnum } from "Api/Modules/Client/Finance/TypeChecking/Transaction/TransactionTypesEnum";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import * as console from "console";
import { OrderStatusEnum } from "Api/Modules/Client/Order/Entities/OrderStatusEnum";

const dbContext = container.resolve(DbContext);

export class PurchaseOrderListener {
  public static async onCreatePurchaseOrder(purchaseOrderId: number) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();
    try {
      const purchaseOrder = await PurchaseOrderService.getPurchaseOrderById(
        purchaseOrderId
      );

      if (purchaseOrder == NULL_OBJECT) return;

      const itemCosts = purchaseOrder.items.map((item) => item.cost);

      const orderCost = sum(itemCosts);

      await PurchaseOrderService.updatePurchaseOrderRecord({
        identifier: purchaseOrderId,
        identifierType: "id",
        updatePayload: {
          cost: orderCost,
        },
        useTransaction: true,
        queryRunner,
      });

      await queryRunner.commitTransaction();
    } catch (PurchaseOrderListenerError) {
      console.log(
        "🚀 ~ PurchaseOrderListener.onCreatePurchaseOrder PurchaseOrderListenerError ->",
        PurchaseOrderListenerError
      );

      await queryRunner.rollbackTransaction();
    }
  }

  public static async onPaymentForPurchaseOrder(purchaseOrderId: number) {
    const queryRunner = await dbContext.getTransactionalQueryRunner();

    await queryRunner.startTransaction();

    try {
      const purchaseOrder = await PurchaseOrderService.getPurchaseOrderById(
        purchaseOrderId
      );

      if (purchaseOrder == NULL_OBJECT) return;

      const customerUserId = await ProfileInternalApi.getCustomerUserId({
        identifier: purchaseOrder.customerId,
        identifierType: "id",
      });

      const customerWallet = await FinanceInternalApi.getWalletByUserId(
        customerUserId
      );

      const salesOrders =
        await SalesOrderService.listSalesOrderByPurchaseOrderId(
          purchaseOrderId
        );

      await FinanceInternalApi.chargeWallet({
        walletId: customerWallet!.id,
        amount: purchaseOrder.cost,
        queryRunner,
      });

      await FinanceInternalApi.createTransactionDetailsRecord({
        queryRunner,
        wallet: customerWallet!,
        amount: purchaseOrder.cost,
        transactionDescription: `Purchase for ${purchaseOrder.identifier}`,
        transactionType: TransactionTypesEnum.WITHDRAWAL,
      });

      for (const order of salesOrders) {
        const merchantUserId = await ProfileInternalApi.getMerchantUserId({
          identifier: order.merchantId,
          identifierType: "id",
        });

        const merchantWallet = await FinanceInternalApi.getWalletByUserId(
          merchantUserId
        );

        const transactionDescription = `Purchase for ${order.identifier})`;

        await FinanceInternalApi.createInternalTransactionRecord({
          amount: order.cost,
          sourceWalletId: customerWallet!.id,
          destinationWalletId: merchantWallet!.id,
          transactionDescription,
          queryRunner,
        });

        await FinanceInternalApi.fundWallet({
          amount: order.cost,
          walletId: merchantWallet!.id,
          queryRunner,
        });

        await FinanceInternalApi.createTransactionDetailsRecord({
          queryRunner,
          wallet: merchantWallet!,
          amount: order.cost,
          transactionType: TransactionTypesEnum.DEPOSIT,
          transactionDescription,
        });

        await SalesOrderService.updateSalesOrderRecord({
          identifier: order.id,
          identifierType: "id",
          updatePayload: {
            status: OrderStatusEnum.PROCESSED,
          },
          queryRunner,
        });
      }

      await PurchaseOrderService.updatePurchaseOrderRecord({
        identifier: purchaseOrderId,
        identifierType: "id",
        updatePayload: {
          status: OrderStatusEnum.PROCESSED,
        },
        queryRunner,
        useTransaction: true,
      });

      await queryRunner.commitTransaction();
    } catch (PurchaseOrderListenerError) {
      console.log(
        "🚀 ~ PurchaseOrderListener.onPaymentForPurchaseOrder PurchaseOrderListenerError ->",
        PurchaseOrderListenerError
      );

      await queryRunner.rollbackTransaction();
    }
  }
}
