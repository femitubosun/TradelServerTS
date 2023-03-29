import { Column, Entity } from "typeorm";
import { BaseEntity } from "Entities/Base";

@Entity()
export class SalesOrderItem extends BaseEntity {
  // @ManyToOne(() => SalesOrder, (order) => order.items)
  // order: SalesOrder;

  @Column({
    nullable: true,
  })
  orderId: number;

  @Column()
  productVariantId: number;

  @Column()
  productId: number;

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
