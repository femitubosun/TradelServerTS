import { PurchaseOrder } from "Api/Modules/Client/Order/Entities";
import { OrderStatusEnum } from "Api/Modules/Client/Order/Entities/OrderStatusEnum";

export interface ISalesOrder {
  id: number;

  identifier: string;

  customerId: number;

  merchantId: number;

  productVariantId?: number;

  purchaseOrder: PurchaseOrder;

  purchaseOrderId?: number;

  productId?: number;

  quantity?: number;

  cost: number;

  status: OrderStatusEnum;
}
