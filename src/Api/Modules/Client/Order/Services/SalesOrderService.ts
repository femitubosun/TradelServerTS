import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { SalesOrder } from "Api/Modules/Client/Order/Entities";
import { Repository } from "typeorm";
import { CreateSalesOrderDto } from "Api/Modules/Client/Order/TypeChecking/SalesOrder/CreateSalesOrderDto";
import { UpdateSalesOrderRecordDto } from "Api/Modules/Client/Order/TypeChecking/SalesOrder/UpdateSalesOrderRecordDto";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";

@autoInjectable()
class SalesOrderService {
  private salesOrderRepository;

  constructor(private dbContext?: DbContext) {
    this.salesOrderRepository = dbContext?.getEntityRepository(
      SalesOrder
    ) as Repository<SalesOrder>;
  }

  public async createSalesOrderRecord(
    createSalesOrderDto: CreateSalesOrderDto
  ) {
    const {
      customerId,
      merchantId,
      quantity,
      purchaseOrder,
      cost,
      productVariantId,
      productId,
      queryRunner,
    } = createSalesOrderDto;

    const salesOrder = new SalesOrder();

    Object.assign(salesOrder, {
      customerId,
      merchantId,
      quantity,
      cost,
      productVariantId,
      purchaseOrder,
      productId,
    });

    await queryRunner.manager.save(salesOrder);

    return salesOrder;
  }

  public async listSalesOrderByPurchaseOrderId(purchaseOrderId: number) {
    return this.salesOrderRepository.find({
      where: {
        purchaseOrderId,
      },
    });
  }

  public async getSalesOrderById(salesOrderId: number) {
    const salesOrder = await this.salesOrderRepository.findOneBy({
      id: salesOrderId,
    });

    return salesOrder || NULL_OBJECT;
  }

  public async getSalesOrderByIdentifier(identifier: string) {
    const salesOrder = await this.salesOrderRepository.findOneBy({
      identifier,
    });

    return salesOrder || NULL_OBJECT;
  }

  public async updateSalesOrderRecord(
    updateSalesOrderRecordDto: UpdateSalesOrderRecordDto
  ) {
    const { identifier, identifierType, updatePayload, queryRunner } =
      updateSalesOrderRecordDto;

    const salesRecord =
      identifierType === "id"
        ? await this.getSalesOrderById(Number(identifier))
        : await this.getSalesOrderByIdentifier(String(identifier));

    Object.assign(salesRecord!, updatePayload);

    await queryRunner.manager.save(salesRecord);

    return salesRecord;
  }
}

export default new SalesOrderService();
