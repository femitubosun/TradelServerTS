import DbQueryRunner from "TypeChecking/QueryRunner";
import { OrderStatusEnum } from "Api/Modules/Client/Order/Entities/OrderStatusEnum";

type UpdateSalesOrderPayload = {
  cost?: number;

  quantity?: number;

  status?: OrderStatusEnum;
};

export type UpdateSalesOrderRecordDto = {
  identifier: number | string;

  identifierType: "id" | "identifier";

  updatePayload: UpdateSalesOrderPayload;
} & DbQueryRunner;
