import { CustomBaseEntity } from "Entities/Base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Merchant } from "Entities/Merchant";

@Entity()
export class Product extends CustomBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  basePrice: number;

  @ManyToOne(() => Merchant)
  merchant: Merchant;
}
