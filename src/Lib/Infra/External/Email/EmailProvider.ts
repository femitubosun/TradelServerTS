import { IEmailDriver } from "Lib/Infra/External/Email/TypeSetting";

export class EmailProvider {
  constructor(private emailDriver: IEmailDriver) {}
}
