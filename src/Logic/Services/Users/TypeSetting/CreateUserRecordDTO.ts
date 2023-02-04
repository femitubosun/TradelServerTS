import { IUser } from "./IUser";

export type CreateUserRecordDTO = Pick<
  IUser,
  "email" | "firstName" | "lastName" | "password" | "role"
>;
