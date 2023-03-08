import { BaseEntity } from "Entities/Base";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
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
        businessConfig.currentDateTime.toUTC();
    }
  }
}
