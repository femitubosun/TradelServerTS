import { BaseEntity } from "Entities/Base";
import { Entity, Column } from "typeorm";

@Entity()
export class CartItem extends BaseEntity {
  @Column({
    nullable: false,
  })
  cartId: number;

  @Column({
    nullable: false,
  })
  productId: number;

  @Column({
    nullable: false,
    default: 1,
  })
  quantity: number;
}
