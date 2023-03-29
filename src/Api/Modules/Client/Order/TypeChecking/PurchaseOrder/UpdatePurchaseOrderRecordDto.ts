import { OrderStatusEnum } from "Api/Modules/Client/Order/Entities/OrderStatusEnum";
import DbQueryRunner from "TypeChecking/QueryRunner";

type UpdatePurchaseOrderRecordPayload = {
  cost?: number;
  status?: OrderStatusEnum;
};

export type UpdatePurchaseOrderRecordDto = {
  identifier: number | string;

  identifierType: "identifier" | "id";

  updatePayload: UpdatePurchaseOrderRecordPayload;

  useTransaction: boolean;

  queryRunner?: DbQueryRunner;
};
