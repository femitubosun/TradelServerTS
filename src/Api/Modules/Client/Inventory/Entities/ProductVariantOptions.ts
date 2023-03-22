import { BaseEntity } from "Entities/Base";
import { Entity, Column } from "typeorm";

@Entity()
export class ProductVariantOptions extends BaseEntity {
  @Column({
    type: "jsonb",
    nullable: true,
  })
  variantOptions?: {
    label: string;
    options: string[];
  }[];

  @Column()
  productId: number;
}
