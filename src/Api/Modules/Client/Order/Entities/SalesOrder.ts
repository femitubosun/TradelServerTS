import { BaseEntity } from "Entities/Base";
import { Column, Entity, ManyToOne } from "typeorm";
import { OrderStatusEnum } from "Api/Modules/Client/Order/Entities/OrderStatusEnum";
import { PurchaseOrder } from "Api/Modules/Client/Order/Entities/PurchaseOrder";

@Entity("sales_orders")
export class SalesOrder extends BaseEntity {
  @Column()
  customerId: number;

  @ManyToOne(() => PurchaseOrder)
  purchaseOrder: PurchaseOrder;

  @Column({ nullable: true })
  purchaseOrderId: number;

  @Column()
  merchantId: number;

  @Column({
    nullable: true,
  })
  productVariantId: number;

  @Column({
    default: true,
  })
  isProduct: boolean;

  @Column({
    nullable: true,
  })
  productId: number;

  @Column({
    default: 1,
  })
  quantity: number;

  @Column({
    nullable: true,
    type: "float",
  })
  cost: number;

  @Column({
    type: "enum",
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status: OrderStatusEnum;

  get forClient() {
    return {
      identifier: this.identifier,
      status: this.status,
      cost: this.cost,
      quantity: this.quantity,
    };
  }
}
