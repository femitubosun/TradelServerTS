import { body } from "express-validator";

export const CreateCollectionValidator = [
  body("label", "Label must be a valid String")
    .isString()
    .isLength({
      min: 3,
      max: 50,
    })
    .withMessage(
      "Label must be at least 3 characters long and no longer than 50 characters"
    ),
];
