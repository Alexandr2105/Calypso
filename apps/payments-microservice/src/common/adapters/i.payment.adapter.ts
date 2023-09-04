interface IPaymentAdapter {
  createPayment(payment: any): Promise<{ data: any; url: string }>;
  validatePayment(payment: any): Promise<{ data: any }>;
}
