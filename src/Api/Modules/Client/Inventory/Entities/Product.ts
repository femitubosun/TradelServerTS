import { BaseEntity } from "Entities/Base";
import { BeforeInsert, Column, Entity, OneToMany, Index } from "typeorm";
import slugify from "slugify";
import { businessConfig } from "Config/businessConfig";
import { ProductVariant } from "Api/Modules/Client/Inventory/Entities/ProductVariant";

@Entity("products")
export class Product extends BaseEntity {
  @Index({
    fulltext: true,
  })
  @Column()
  name: string;

  @Column()
  nameSlug: string;

  @Column()
  description: string;

  @Column({
    type: "float",
  })
  basePrice: number;

  @Column({
    default: 1,
  })
  stock: number;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @Column()
  merchantId: number;

  @Column("tsvector", { select: false })
  documentWithWeights: any;

  @BeforeInsert()
  generateSlug() {
    if (this.name) {
      this.nameSlug =
        slugify(this.name, { lower: true }) +
        "-" +
        businessConfig.currentDateTime().toUTC();
    }
  }

  public get forClient() {
    return {
      identifier: this.identifier,
      name: this.name,
      name_slug: this.nameSlug,
      description: this.description,
      base_price: this.basePrice,
      meta: {
        created_at: this.createdAt,
        updated_at: this.updatedAt,
        variants: {},
      },
    };
  }
}
