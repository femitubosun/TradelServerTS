import { param } from "express-validator";

export const AccessCollectionResourceByIdentifierValidator = [
  param(
    "collectionIdentifier",
    "Collection Identifier must be a valid UUID"
  ).isUUID(),
];
