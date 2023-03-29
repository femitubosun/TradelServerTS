import { autoInjectable } from "tsyringe";
import { DbContext } from "Lib/Infra/Internal/DBContext";
import { Repository } from "typeorm";
import { PurchaseOrder } from "Api/Modules/Client/Order/Entities";
import { CreatePurchaseOrderDto } from "Api/Modules/Client/Order/TypeChecking/PurchaseOrder/CreatePurchaseOrderDto";
import { NULL_OBJECT } from "Api/Modules/Common/Helpers/Messages/SystemMessages";
import { UpdatePurchaseOrderRecordDto } from "Api/Modules/Client/Order/TypeChecking/PurchaseOrder/UpdatePurchaseOrderRecordDto";

@autoInjectable()
class PurchaseOrderService {
  private purchaseOrdersRepository;

  constructor(private dbContext?: DbContext) {
    this.purchaseOrdersRepository = dbContext?.getEntityRepository(
      PurchaseOrder
    ) as Repository<PurchaseOrder>;
  }

  public async createPurchaseOrderRecord(
    createPurchaseOrderRecordDto: CreatePurchaseOrderDto
  ) {
    const { customerId, queryRunner, items } = createPurchaseOrderRecordDto;

    const purchaseOrder = new PurchaseOrder();

    Object.assign(purchaseOrder, {
      customerId,
      items,
    });

    await queryRunner.manager.save(purchaseOrder);

    return purchaseOrder;
  }

  public async getPurchaseOrderById(purchaseOrderId: number) {
    const purchaseOrder = await this.purchaseOrdersRepository.findOne({
      where: {
        id: purchaseOrderId,
      },
      relations: {
        items: true,
      },
    });

    return purchaseOrder || NULL_OBJECT;
  }

  public async getPurchaseOrderByIdentifier(identifier: string) {
    const purchaseOrder = await this.purchaseOrdersRepository.findOne({
      where: {
        identifier,
      },
      relations: {
        items: true,
      },
    });

    return purchaseOrder || NULL_OBJECT;
  }

  public async deletePurchaseOrder(purchaseOrderId: number) {
    return await this.purchaseOrdersRepository.delete(purchaseOrderId);
  }

  public async listPurchaseOrderByCustomerId(customerId: number) {
    return await this.purchaseOrdersRepository.findBy({
      customerId,
    });
  }

  public async updatePurchaseOrderRecord(
    updatePurchaseOrderDto: UpdatePurchaseOrderRecordDto
  ) {
    const {
      identifier,
      identifierType,
      updatePayload,
      queryRunner,
      useTransaction,
    } = updatePurchaseOrderDto;

    const purchaseOrder =
      identifierType == "id"
        ? await this.getPurchaseOrderById(identifier as number)
        : await this.getPurchaseOrderByIdentifier(identifier as string);

    if (purchaseOrder == NULL_OBJECT) return;

    Object.assign(purchaseOrder, updatePayload);

    if (useTransaction) {
      await queryRunner!.manager.save(purchaseOrder);
    } else {
      this.purchaseOrdersRepository.save(purchaseOrder);
    }

    return purchaseOrder;
  }
}

export default new PurchaseOrderService();
