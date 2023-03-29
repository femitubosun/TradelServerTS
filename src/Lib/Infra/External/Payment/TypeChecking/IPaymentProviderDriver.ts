export interface IPaymentProviderDriver {
  pay(): null;

  confirmTransaction(): null;
}
