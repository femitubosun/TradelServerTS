import { CartItem } from "Api/Modules/Client/Inventory/Entities";
import QueryRunner from "TypeChecking/QueryRunner";

type UpdateCartRecordPayload = {
  items?: CartItem[];
  updatedAt?: string;
  createdAt?: string;
  isActive?: boolean;
  isDeleted?: boolean;
};

export type UpdateCartRecordDto = {
  identifier: number | string;
  identifierType: "id" | "identifier";
  updatePayload: UpdateCartRecordPayload;
} & QueryRunner;
