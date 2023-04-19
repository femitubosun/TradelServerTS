import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Wallet } from "Api/Modules/Client/Finance/Entities";
import { Repository } from "typeorm";
import { PurchaseOrderItem } from "Api/Modules/Client/Order/Entities";
import { CreatePurchaseOrderItemDto } from "Api/Modules/Client/Order/TypeChecking/PurchaseOderItem/CreatePurchaseOrderItemDto";

@autoInjectable()
class PurchaseOrderItemService {
  private orderItemsRepository;

  constructor(private dbContext?: DbContext) {
    this.orderItemsRepository = dbContext?.getEntityRepository(
      Wallet
    ) as Repository<PurchaseOrderItem>;
  }

  public async createPurchaseOrderItemRecord(
    createOrderItemRecordDto: CreatePurchaseOrderItemDto
  ) {
    const {
      order,
      productVariantId,
      productId,
      quantity,
      cost,
      isProduct,
      queryRunner,
    } = createOrderItemRecordDto;

    const purchaseOrderItem = new PurchaseOrderItem();

    Object.assign(purchaseOrderItem, {
      order,
      productVariantId,
      productId,
      quantity,
      isProduct,
      cost,
    });

    await queryRunner.manager.save(purchaseOrderItem);

    return purchaseOrderItem;
  }
}

export default new PurchaseOrderItemService();
