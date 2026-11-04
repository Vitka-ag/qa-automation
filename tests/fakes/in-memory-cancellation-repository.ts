import type {
  CancellationOrder,
  CancellationRepository,
} from '../../src/order-cancellation-service';

export class InMemoryCancellationRepository implements CancellationRepository {
  private orders = new Map<string, CancellationOrder>();

  constructor(initialOrders: CancellationOrder[] = []) {
    for (const order of initialOrders) {
      this.orders.set(order.id, { ...order });
    }
  }

  async findById(id: string): Promise<CancellationOrder | undefined> {
    const order = this.orders.get(id);
    return order ? { ...order } : undefined;
  }

  async save(order: CancellationOrder): Promise<void> {
    this.orders.set(order.id, { ...order });
  }

  get size(): number {
    return this.orders.size;
  }
}
