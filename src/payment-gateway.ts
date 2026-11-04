import type { PaymentGateway } from './order-cancellation-service';

export class HttpPaymentGateway implements PaymentGateway {
  constructor(private baseUrl: string) {}

  async refund(orderId: string, amount: number): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, amount }),
    });

    if (!response.ok) {
      throw new Error('PAYMENT_HTTP_ERROR');
    }

    const data: unknown = await response.json();

    if (
      typeof data !== 'object' ||
      data === null ||
      !('success' in data) ||
      typeof data.success !== 'boolean'
    ) {
      throw new Error('INVALID_PAYMENT_FORMAT');
    }

    return data.success;
  }
}
