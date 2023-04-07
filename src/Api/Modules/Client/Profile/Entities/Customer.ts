import { BaseEntity } from "Entities/Base";
import { Entity, Column } from "typeorm";

@Entity("customers")
export class Customer extends BaseEntity {
  @Column()
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  userId: number;
}
