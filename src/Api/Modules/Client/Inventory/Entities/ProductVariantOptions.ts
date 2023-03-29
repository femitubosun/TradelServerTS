import { BaseEntity } from "Entities/Base";
import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { CartesianProduct } from "Api/Modules/Client/Inventory/Helpers/CartesianProduct";
import { Product } from "Api/Modules/Client/Inventory/Entities/Product";

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

  @Column({
    nullable: true,
  })
  productId: number;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  get variantCombinations(): string[][] {
    const varOptions = this.variantOptions!.map((el) => {
      return el.options;
    });

    // @ts-ignore
    return CartesianProduct(...varOptions);
  }

  get forClient() {
    return {
      variant_options: this.variantOptions,
      variant_combinations: this.variantCombinations,
    };
  }
}
