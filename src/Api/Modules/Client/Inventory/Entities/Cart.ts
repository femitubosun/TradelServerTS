import { BaseEntity } from "Entities/Base";
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Product } from "Api/Modules/Client/Inventory/Entities/Product";

@Entity()
export class Cart extends BaseEntity {
  @Column({
    nullable: true,
  })
  customerId: number;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
