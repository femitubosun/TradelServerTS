import { BaseEntity } from "Entities/Base";
import { Column, Entity, ManyToOne } from "typeorm";
import { Cart } from "Api/Modules/Client/Inventory/Entities/Cart";
import { ProductVariant } from "Api/Modules/Client/Inventory/Entities/ProductVariant";
import { Product } from "Api/Modules/Client/Inventory/Entities/Product";

@Entity()
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @Column({
    nullable: true,
  })
  cartId: number;

  @ManyToOne(() => ProductVariant, {
    nullable: true,
  })
  productVariant: ProductVariant;

  @Column({
    nullable: true,
  })
  productVariantId: number;

  @ManyToOne(() => Product, {
    nullable: true,
  })
  product: Product;

  @Column({
    nullable: true,
  })
  productId: number;

  @Column({
    default: true,
  })
  isProduct: boolean;

  @Column({
    default: 1,
  })
  quantity: number;

  public get price() {
    return this.productVariant.price * this.quantity;
  }

  public get forClient() {
    return {
      identifier: this.identifier,
      quantity: this.quantity,
    };
  }
}
