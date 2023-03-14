import { body } from "express-validator";

export const CreateNewMerchantValidator = [
  body("email", "Email Should be an email").normalizeEmail().isEmail(),
  body("password", "Password required").isLength({
    min: 8,
  }),
  body("first_name", "First Name required").isLength({
    min: 2,
  }),
  body("last_name", "Last Name required").isLength({
    min: 2,
  }),
  body("phone_number", "Phone number required").isLength({
    min: 10,
  }),
  body("store_name", "Store name is required").isLength({
    min: 3,
  }),
];
