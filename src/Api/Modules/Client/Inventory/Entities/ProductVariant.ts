import { BaseEntity } from "Entities/Base";
import { Column, Entity } from "typeorm";

@Entity()
export class ProductVariant extends BaseEntity {
  @Column({
    nullable: false,
  })
  sku: string;

  @Column()
  productId: number;

  @Column()
  price: number;

  @Column({
    nullable: true,
  })
  photoUrl: string;

  @Column("text", { array: true })
  parentVariants: string[];

  public get forClient() {
    return {
      identifier: this.identifier,
      sku: this.sku,
      price: this.price,
      parent_variants: this.parentVariants,
      photo_url: this.photoUrl,
    };
  }
}
