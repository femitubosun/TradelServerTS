import { Product } from "Api/Modules/Client/Inventory/Entities";

type UpdateCartRecordPayload = {
  products?: Product[];
  updatedAt?: string;
  createdAt?: string;
  isActive?: boolean;
  isDeleted?: boolean;
};

export type UpdateCartRecordDto = {
  identifier: number | string;
  identifierType: "id" | "identifier";
  updatePayload: UpdateCartRecordPayload;
};
