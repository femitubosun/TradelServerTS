import { DateTime } from "luxon";

export interface IProduct {
  productId: number;

  productIdentifier: string;

  name: string;

  nameSlug: string;

  description: string;

  basePrice: number;

  merchantId: number;

  createdAt: DateTime;

  updatedAt: DateTime;
}
