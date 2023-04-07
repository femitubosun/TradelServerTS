import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "Entities/Base";
import { PurchaseOrder } from "Api/Modules/Client/Order/Entities/PurchaseOrder";

@Entity("purchase_order_items")
export class PurchaseOrderItem extends BaseEntity {
  @ManyToOne(() => PurchaseOrder, (order) => order.items)
  order: PurchaseOrder;

  @Column({
    nullable: true,
  })
  orderId: number;

  @Column({
    nullable: true,
  })
  productVariantId: number;

  @Column({
    nullable: true,
  })
  productId: number;

  @Column({
    default: true,
  })
  isProduct: boolean;

  @Column()
  quantity: number;

  @Column({
    type: "float",
    nullable: true,
  })
  cost: number;

  public get forClient() {
    return {
      identifier: this.identifier,
      quantity: this.quantity,
      cost: this.cost,
    };
  }
}
