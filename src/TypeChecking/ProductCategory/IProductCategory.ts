import { DateTime } from "luxon";

export interface IProductCategory {
  productCategoryId: number;

  productCategoryIdentifier: string;

  name: string;

  nameSlug: string;

  photoUrl?: string;

  isActive: boolean;

  isDeleted: boolean;

  updatedAt: DateTime;

  createdAt: DateTime;
}
