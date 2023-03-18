import { body, param } from "express-validator";

export const UpdateCollectionValidator = [
  param(
    "collectionIdentifier",
    "Collection Identifier must be a valid UUID"
  ).isUUID(),
  body("label")
    .isString()
    .withMessage("Label must be a valid string")
    .trim()
    .escape()
    .isLength({
      min: 3,
      max: 50,
    })
    .withMessage(
      "Label must be at least 3 characters long and no longer than 50 characters"
    ),
];
