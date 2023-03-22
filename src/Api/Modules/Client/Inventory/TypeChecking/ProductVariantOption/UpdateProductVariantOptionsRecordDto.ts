import { VariantOption } from "Api/Modules/Client/Inventory/TypeChecking/ProductVariantOption/VariantOption";
import DbQueryRunner from "TypeChecking/QueryRunner";

type UpdateProductVariantOptionsRecordPayload = {
  variantOptions: VariantOption[];
};

export type UpdateProductVariantOptionsRecordDto = {
  identifier: number | string;

  identifierType: "id" | "identifier" | "productId";

  updatePayload: UpdateProductVariantOptionsRecordPayload;
} & DbQueryRunner;
