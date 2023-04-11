import { BaseEntity } from "Entities/Base";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import slugify from "slugify";
import { businessConfig } from "Config/businessConfig";
import { NOT_APPLICABLE } from "Api/Modules/Common/Helpers/Messages/SystemMessages";

@Entity("merchants")
export class Merchant extends BaseEntity {
  @Column()
  storeName: string;

  @Column()
  storeNameSlug: string;

  @Column()
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  photoUrl: string;

  @Column({ nullable: true })
  userId: number;

  @Column("tsvector", { select: false })
  documentWithWeights: any;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.storeName) {
      this.storeNameSlug =
        slugify(this.storeName, { lower: true }) +
        "-" +
        businessConfig.currentDateTime().toUTC();
    }
  }

  public get forClient() {
    return {
      identifier: this.identifier,
      store_name: this.storeName,
      store_name_slug: this.storeNameSlug,
      photo_url: this.photoUrl || NOT_APPLICABLE,
    };
  }
}
