import PurchaseOrderService from "Api/Modules/Client/Order/Services/PurchaseOrderService";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { sum } from "lodash";
import { container } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import * as console from "console";

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
}
