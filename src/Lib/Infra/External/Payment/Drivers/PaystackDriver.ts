import { IPaymentProviderDriver } from "Lib/Infra/External/Payment/TypeChecking/IPaymentProviderDriver";

export class PaystackDriver implements IPaymentProviderDriver {
  confirmTransaction(): null {
    return null;
  }

  pay(): null {
    return null;
  }
}
