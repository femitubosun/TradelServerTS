import { VariantOption } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariantOption/VariantOption";

export interface IProductVariantOptions {
  id: number;

  identifier: string;

  productId: number;

  variantOptions: VariantOption[];
}
