import { EventEmitter } from "events";
import { OrderEventTypesEnum } from "Api/Modules/Client/Order/TypeChecking/GeneralPurpose/OrderEventTypesEnum";
import { PurchaseOrderListener } from "Api/Modules/Client/Order/Events/Listeners/PurchaseOrderListener";

export const Event: EventEmitter = new EventEmitter();

Event.on(
  OrderEventTypesEnum.order.createPurchaseOrder,
  PurchaseOrderListener.onCreatePurchaseOrder
);

Event.on(
  OrderEventTypesEnum.order.paymentForPurchaseOrder,
  PurchaseOrderListener.onPaymentForPurchaseOrder
);
