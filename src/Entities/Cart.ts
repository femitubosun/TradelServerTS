import { BaseEntity } from "Entities/Base";
import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { Customer } from "Entities/Customer";

@Entity()
export class Cart extends BaseEntity {
  @OneToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @Column({
    nullable: true,
  })
  customerId: number;
}
