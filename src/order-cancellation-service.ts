export interface CancellationOrder {
  id: string;
  amount: number;
  email: string;
  status: 'paid' | 'cancelled';
  cancelledAt?: string;
}

export interface PaymentGateway {
  refund(orderId: string, amount: number): Promise<boolean>;
}

export interface CancellationRepository {
  findById(id: string): Promise<CancellationOrder | undefined>;
  save(order: CancellationOrder): Promise<void>;
}

export interface CancellationNotifier {
  send(email: string, message: string): Promise<void>;
}

export interface Clock {
  now(): Date;
}

export class OrderCancellationService {
  constructor(
    private payments: PaymentGateway,
    private repository: CancellationRepository,
    private notifier: CancellationNotifier,
    private clock: Clock,
  ) {}

  async cancel(orderId: string): Promise<CancellationOrder> {
    const order = await this.repository.findById(orderId);

    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }

    if (order.status !== 'paid') {
      throw new Error('ORDER_NOT_PAID');
    }

    const refunded = await this.payments.refund(order.id, order.amount);

    if (!refunded) {
      throw new Error('REFUND_FAILED');
    }

    const cancelled: CancellationOrder = {
      ...order,
      status: 'cancelled',
      cancelledAt: this.clock.now().toISOString(),
    };

    await this.repository.save(cancelled);

    await this.notifier.send(
      order.email,
      `Замовлення ${order.id} скасовано. Кошти повернено.`,
    );

    return cancelled;
  }
}
