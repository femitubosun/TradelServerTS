import { DateTime } from "luxon";
import { Product } from "Api/Modules/Client/Inventory/Entities";

export interface ICollection {
  id: number;

  identifier: string;

  label: string;

  slug: string;

  imageUrl: string;

  merchantId: number;

  items: Product[];

  createdAt: DateTime;

  updatedAt: DateTime;
}
