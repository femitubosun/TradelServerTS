import { DateTime } from "luxon";
import { PurchaseOrder } from "Api/Modules/Client/Order/Entities";

export interface IPurchaseOrderItem {
  id: number;

  identifier: string;

  productVariantId?: number;

  productId?: number;

  orderId: number;

  order: PurchaseOrder;

  quantity: number;

  isProduct: boolean;

  cost?: number;

  isActive: boolean;

  isDeleted: boolean;

  createdAt: DateTime;

  updatedAt: DateTime;
}
