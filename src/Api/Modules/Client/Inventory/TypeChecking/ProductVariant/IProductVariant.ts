import { DateTime } from "luxon";

export interface IProductVariant {
  id: number;

  identifier: string;

  sku: string;

  price: number;

  parentVariants: string[];

  productId: number;

  createdAt: DateTime;

  updatedAt: DateTime;
}
