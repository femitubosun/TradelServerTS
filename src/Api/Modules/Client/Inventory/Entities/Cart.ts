import { BaseEntity } from "Entities/Base";
import { Entity, Column } from "typeorm";

@Entity()
export class Cart extends BaseEntity {
  @Column({
    nullable: true,
  })
  customerId: number;
}
