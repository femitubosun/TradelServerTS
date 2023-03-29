import { IPaymentProviderDriver } from "Lib/Infra/External/Payment/TypeChecking/IPaymentProviderDriver";

export class PaymentProvider {
  private driver: IPaymentProviderDriver;

  constructor(paymentDriver: IPaymentProviderDriver) {
    this.driver = paymentDriver;
  }

  // public async initiateTransaction() {}
  //
  // public async confirmTransaction() {}
}
