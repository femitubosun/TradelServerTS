import { ICollection } from "Api/Modules/Client/Inventory/TypeChecking/Collection/ICollection";
import DbQueryRunner from "TypeChecking/QueryRunner";

export type CreateCollectionRecordDto = Pick<
  ICollection,
  "merchantId" | "label"
> &
  DbQueryRunner;
