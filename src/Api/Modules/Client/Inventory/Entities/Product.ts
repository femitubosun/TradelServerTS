import { BaseEntity } from "Entities/Base";
import { BeforeInsert, Column, Entity } from "typeorm";
import slugify from "slugify";
import { businessConfig } from "Config/businessConfig";

@Entity()
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column()
  nameSlug: string;

  @Column()
  description: string;

  @Column()
  basePrice: number;

  @Column()
  merchantId: number;

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
