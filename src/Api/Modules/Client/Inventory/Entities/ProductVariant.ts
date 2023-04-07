import { BaseEntity } from "Entities/Base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Product } from "Api/Modules/Client/Inventory/Entities/Product";

@Entity("product_variants")
export class ProductVariant extends BaseEntity {
  @Column({
    nullable: false,
  })
  sku: string;

  @Column({
    type: "float",
  })
  price: number;

  @Column({
    default: 1,
  })
  public stock: number;

  @Column({
    nullable: true,
  })
  photoUrl: string;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @Column({
    nullable: true,
  })
  productId: number;

  @Column("text", { array: true })
  parentVariants: string[];

  public get forMerchantClient() {
    return {
      identifier: this.identifier,
      sku: this.sku,
      price: this.price,
      stock: this.stock,
      parent_variants: this.parentVariants,
      photo_url: this.photoUrl,
    };
  }

  public get forCustomerClient() {
    return {
      identifier: this.identifier,
      sku: this.sku,
      price: this.price,
      parent_variants: this.parentVariants,
      photo_url: this.photoUrl,
    };
  }
}
