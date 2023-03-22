export type IsCombinationInVariantOptionDto = {
  identifier: string | number;

  identifierType: "id" | "productId" | "identifier";

  combination: string[];
};
