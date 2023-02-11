import { CustomBaseEntity } from "Entities/Base";
import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { Customer } from "Entities/Customer";

@Entity()
export class Cart extends CustomBaseEntity {
  @OneToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @Column({
    nullable: true,
  })
  customerId: number;
}
