import { BaseEntity } from "Entities/Base";
import { Entity, Column } from "typeorm";
import { CartesianProduct } from "Api/Modules/Client/Inventory/Helpers/CartesianProduct";

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
