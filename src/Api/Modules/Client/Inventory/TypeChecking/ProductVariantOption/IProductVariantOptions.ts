import { VariantOption } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariantOption/VariantOption";
import { Product } from "Api/Modules/Client/Inventory/Entities";

export interface IProductVariantOptions {
  id: number;

  identifier: string;

  product: Product;

  productId: number;

  variantOptions: VariantOption[];
}
