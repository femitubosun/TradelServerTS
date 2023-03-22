import { body, param } from "express-validator";

export const AddProductToCollectionValidator = [
  param(
    "collectionIdentifier",
    "Collection Identifier should be a valid UUID"
  ).isUUID(),
  body(
    "product_identifier",
    "Product Identifier should be a valid UUID"
  ).isUUID(),
];
