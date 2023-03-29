import { BaseEntity } from "Entities/Base";
import { Column, Entity, OneToMany } from "typeorm";
import { PurchaseOrderItem } from "Api/Modules/Client/Order/Entities/PurchaseOrderItem";
import { OrderStatusEnum } from "Api/Modules/Client/Order/Entities/OrderStatusEnum";

@Entity()
export class PurchaseOrder extends BaseEntity {
  @Column()
  customerId: number;

  @OneToMany(() => PurchaseOrderItem, (item) => item.order)
  items: PurchaseOrderItem[];

  @Column({
    type: "float",
    nullable: true,
  })
  cost: number;

  @Column({
    type: "enum",
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status: OrderStatusEnum;

  public get forClient() {
    return {
      identifier: this.identifier,
      cost: this.cost,
      status: this.status,
    };
  }
}
