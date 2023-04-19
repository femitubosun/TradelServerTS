import { businessConfig } from "Config/businessConfig";
import { FlutterwaveDriver } from "Lib/Infra/External/Payment/Drivers/FlutterwaveDriver";
import { PaymentProvider } from "Lib/Infra/External/Payment/PaymentProvider";
import { PaystackDriver } from "Lib/Infra/External/Payment/Drivers/PaystackDriver";

export class PaymentProviderFactory {
  public static getPaymentProvider() {
    return new PaymentProvider(new PaystackDriver());
  }

  public static get currentPaymentProvider() {
    return businessConfig.paymentProvider;
  }
}
