import { DateTime } from "luxon";
import { Product } from "Api/Modules/Client/Inventory/Entities";

export interface IProductVariant {
  id: number;

  identifier: string;

  sku: string;

  price: number;

  stock: number;

  parentVariants: string[];

  product: Product;

  productId: number;

  createdAt: DateTime;

  updatedAt: DateTime;
}
