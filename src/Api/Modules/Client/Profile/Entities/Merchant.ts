import { BaseEntity } from "Entities/Base";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import slugify from "slugify";
import { businessConfig } from "Config/businessConfig";

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
}
