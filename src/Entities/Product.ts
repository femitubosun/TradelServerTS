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

  @Column({
    nullable: true,
  })
  photoUrl: string;

  @Column()
  merchantId: number;

  @Column()
  categoryId: number;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.nameSlug =
        slugify(this.name, { lower: true }) +
        "-" +
        businessConfig.currentDateTime.toUTC();
    }
  }
}
