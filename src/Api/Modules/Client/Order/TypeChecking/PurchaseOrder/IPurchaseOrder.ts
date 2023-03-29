import { PurchaseOrderItem } from "Api/Modules/Client/Order/Entities";
import { DateTime } from "luxon";

export interface IPurchaseOrder {
  id: number;

  identifier: string;

  customerId: number;

  items: PurchaseOrderItem[];

  cost?: number;

  isActive: boolean;

  isDeleted: boolean;

  createdAt: DateTime;

  updatedAt: DateTime;
}
