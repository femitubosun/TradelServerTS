export type GetMerchantUserIdDto = {
  identifierType: "id" | "identifier";

  identifier: string | number;
};
