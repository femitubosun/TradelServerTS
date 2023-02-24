import { DateTime } from "luxon";

export interface IProduct {
  productId: number;

  productIdentifier: string;

  name: string;

  nameSlug: string;

  description: string;

  basePrice: number;

  photoUrl: string;

  merchantId: number;

  categoryId: number;

  createdAt: DateTime;

  updatedAt: DateTime;
}
