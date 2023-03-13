import { DateTime } from "luxon";

export interface ICustomer {
  id: number;

  identifier: string;

  phoneNumber: string;

  isActive: boolean;

  isDeleted: boolean;

  createdAt: DateTime;

  updatedAt: DateTime;
}
