import { BaseEntity } from "Entities/Base";
import { Column, Entity, JoinTable, OneToMany } from "typeorm";
import { CartItem } from "Api/Modules/Client/Inventory/Entities/CartItem";

@Entity()
export class Cart extends BaseEntity {
  @Column({
    nullable: true,
  })
  customerId: number;

  @OneToMany(() => CartItem, (item) => item.cart)
  @JoinTable()
  items: CartItem[];
}
