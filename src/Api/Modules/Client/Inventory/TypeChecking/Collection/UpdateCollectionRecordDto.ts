import DbQueryRunner from "TypeChecking/QueryRunner";
import { Product } from "Api/Modules/Client/Inventory/Entities";

type UpdatePayload = {
  label?: string;
  labelSlug?: string;
  imageUrl?: string;
  items?: Product[];
};

export type UpdateCollectionRecordDto = {
  identifier: string | number;
  identifierType: "id" | "identifier";
  updatePayload: UpdatePayload;
} & DbQueryRunner;
