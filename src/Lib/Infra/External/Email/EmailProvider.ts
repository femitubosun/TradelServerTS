import { IEmailDriver } from "Lib/Infra/External/Email/TypeSetting/IEmailDriver";

export class EmailProvider {
  constructor(private emailDriver: IEmailDriver) {}
}
