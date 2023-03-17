import { BaseEntity } from "Entities/Base";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { CartItem } from "Api/Modules/Client/Inventory/Entities/CartItem";

@Entity()
export class Cart extends BaseEntity {
  @Column({
    nullable: true,
  })
  customerId: number;

  @ManyToMany(() => CartItem)
  @JoinTable()
  items: CartItem[];
}
