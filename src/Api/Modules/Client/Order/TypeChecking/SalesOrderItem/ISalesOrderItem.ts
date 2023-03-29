import { SalesOrder } from "Api/Modules/Client/Order/Entities";

export interface ISalesOrderItem {
  id: number;

  identifier: string;

  order: SalesOrder;

  orderId: number;

  productVariantId?: number;

  productId?: number;

  quantity: number;

  cost: number;
}
