interface IPaymentAdapter {
  createPayment(
    payment: any,
  ): Promise<{ data: any; url: string; subscriptionTimeHours: number }>;
  validatePayment(payment: any): Promise<void>;
}
