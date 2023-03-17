import { BaseEntity } from "Entities/Base";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Product } from "Api/Modules/Client/Inventory/Entities/Product";

@Entity()
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
}
