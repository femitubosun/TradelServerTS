import { DbContext } from "Lib/Infra/Internal/DBContext";
import { SalesOrderItem } from "Api/Modules/Client/Order/Entities";
import { Repository } from "typeorm";
import { CreateSalesOrderItemDto } from "Api/Modules/Client/Order/TypeChecking/SalesOrderItem/CreateSalesOrderItemDto";
import { autoInjectable } from "tsyringe";

@autoInjectable()
class SalesOrderItemService {
  private salesOrderItemRepository;

  constructor(private dbContext?: DbContext) {
    this.salesOrderItemRepository = dbContext?.getEntityRepository(
      SalesOrderItem
    ) as Repository<SalesOrderItem>;
  }

  public async createSalesOrderItemRecord(
    createSalesOrderItemDto: CreateSalesOrderItemDto
  ) {
    const { order, productVariantId, productId, quantity, cost, queryRunner } =
      createSalesOrderItemDto;

    const salesOrderItem = new SalesOrderItem();

    Object.assign(salesOrderItem, {
      order,
      productVariantId,
      productId,
      quantity,
      cost,
    });

    await queryRunner.manager.save(salesOrderItem);

    return salesOrderItem;
  }
}

export default new SalesOrderItemService();
