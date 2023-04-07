import { BaseEntity } from "Entities/Base";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Product } from "Api/Modules/Client/Inventory/Entities/Product";
import slugify from "slugify";
import { businessConfig } from "Config/businessConfig";
import { NOT_APPLICABLE } from "Api/Modules/Common/Helpers/Messages/SystemMessages";

@Entity("collections")
export class Collection extends BaseEntity {
  @Column({
    nullable: false,
  })
  merchantId: number;

  @Column({ nullable: false })
  label: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToMany(() => Product)
  @JoinTable()
  items: Product[];

  @BeforeInsert()
  generateSlug() {
    if (this.label) {
      this.slug =
        slugify(this.label, { lower: true }) +
        "-" +
        businessConfig.currentDateTime().toUTC();
    }
  }

  public get forClient() {
    return {
      identifier: this.identifier,
      label: this.label,
      slug: this.slug,
      image_url: this.imageUrl || NOT_APPLICABLE,
      meta: {
        created_at: this.createdAt,
        updated_at: this.updatedAt,
      },
    };
  }
}
