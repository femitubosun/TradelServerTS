import { BaseEntity } from "Entities/Base";
import { Column, Entity } from "typeorm";

@Entity()
export class ProductVariant extends BaseEntity {
  @Column({
    nullable: false,
  })
  sku: string;

  @Column()
  productId: number;

  @Column()
  price: number;

  @Column("text", { array: true })
  variantParents: string[];
}

// export const ProductVariant = new mongoose.Schema({
//   productId: {
//     type: String,
//     required: true,
//   },
//
//   sku: {
//     type: String,
//     required: true,
//   },
//
//   price: {
//     type: Number,
//     required: true,
//   },
//
//   variantParents: [String],
// });
