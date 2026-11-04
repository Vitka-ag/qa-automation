import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InMemoryCancellationRepository } from './fakes/in-memory-cancellation-repository';

import {
  OrderCancellationService,
  type CancellationOrder,
  type PaymentGateway,
  type CancellationRepository,
  type CancellationNotifier,
  type Clock,
} from '../src/order-cancellation-service';

describe('OrderCancellationService', () => {
  let payments: PaymentGateway;
  let repository: CancellationRepository;
  let notifier: CancellationNotifier;
  let clock: Clock;
  let service: OrderCancellationService;

  const order: CancellationOrder = {
    id: 'order-1',
    amount: 500,
    email: 'test@example.com',
    status: 'paid',
  };

  beforeEach(() => {
    payments = {
      refund: vi.fn().mockResolvedValue(true),
    };

    repository = {
      findById: vi.fn().mockResolvedValue({ ...order }),
      save: vi.fn().mockResolvedValue(undefined),
    };

    notifier = {
      send: vi.fn().mockResolvedValue(undefined),
    };

    clock = {
      now: vi.fn().mockReturnValue(new Date('2026-01-01T12:00:00.000Z')),
    };

    service = new OrderCancellationService(
      payments,
      repository,
      notifier,
      clock,
    );
  });

  it('successfully cancels a paid order', async () => {
    const result = await service.cancel('order-1');

    expect(result).toEqual({
      ...order,
      status: 'cancelled',
      cancelledAt: '2026-01-01T12:00:00.000Z',
    });

    expect(payments.refund).toHaveBeenCalledWith('order-1', 500);
    expect(repository.save).toHaveBeenCalledWith(result);
  });

  it('sends a notification after successful cancellation', async () => {
    await service.cancel('order-1');

    expect(notifier.send).toHaveBeenCalledWith(
      'test@example.com',
      'Замовлення order-1 скасовано. Кошти повернено.',
    );
  });

  it('throws when order does not exist', async () => {
    vi.mocked(repository.findById).mockResolvedValue(undefined);

    await expect(service.cancel('missing')).rejects.toThrow('ORDER_NOT_FOUND');

    expect(payments.refund).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
    expect(notifier.send).not.toHaveBeenCalled();
  });

  it('throws when order is not paid', async () => {
    vi.mocked(repository.findById).mockResolvedValue({
      ...order,
      status: 'cancelled',
    });

    await expect(service.cancel('order-1')).rejects.toThrow('ORDER_NOT_PAID');

    expect(payments.refund).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
    expect(notifier.send).not.toHaveBeenCalled();
  });

  it('throws when refund fails', async () => {
    vi.mocked(payments.refund).mockResolvedValue(false);

    await expect(service.cancel('order-1')).rejects.toThrow('REFUND_FAILED');

    expect(repository.save).not.toHaveBeenCalled();
    expect(notifier.send).not.toHaveBeenCalled();
  });

  it('updates repository state after successful cancellation', async () => {
    const fakeRepository = new InMemoryCancellationRepository([{ ...order }]);

    const cancellationService = new OrderCancellationService(
      payments,
      fakeRepository,
      notifier,
      clock,
    );

    await cancellationService.cancel('order-1');

    const savedOrder = await fakeRepository.findById('order-1');

    expect(savedOrder).toEqual({
      ...order,
      status: 'cancelled',
      cancelledAt: '2026-01-01T12:00:00.000Z',
    });

    expect(fakeRepository.size).toBe(1);
  });

  it('does not save or notify when payment gateway throws', async () => {
    vi.mocked(payments.refund).mockRejectedValue(
      new Error('PAYMENT_HTTP_ERROR'),
    );

    await expect(service.cancel('order-1')).rejects.toThrow(
      'PAYMENT_HTTP_ERROR',
    );

    expect(repository.save).not.toHaveBeenCalled();
    expect(notifier.send).not.toHaveBeenCalled();
  });
});
