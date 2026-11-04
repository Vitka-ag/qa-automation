import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server, REFUND_URL } from './msw/server';
import { HttpPaymentGateway } from '../src/payment-gateway';

describe('HttpPaymentGateway — MSW', () => {
  const gateway = new HttpPaymentGateway('https://payments.example.com');

  it('успішно повертає кошти', async () => {
    await expect(gateway.refund('A-1', 500)).resolves.toBe(true);
  });

  it('обробляє помилковий HTTP-статус', async () => {
    server.use(
      http.post(REFUND_URL, () => new HttpResponse(null, { status: 503 })),
    );

    await expect(gateway.refund('A-1', 500)).rejects.toThrow(
      'PAYMENT_HTTP_ERROR',
    );
  });

  it('відхиляє некоректний формат відповіді', async () => {
    server.use(
      http.post(REFUND_URL, () => HttpResponse.json({ success: 'yes' })),
    );

    await expect(gateway.refund('A-1', 500)).rejects.toThrow(
      'INVALID_PAYMENT_FORMAT',
    );
  });

  it('правильно передає дані платежу', async () => {
    let receivedBody: unknown;

    server.use(
      http.post(REFUND_URL, async ({ request }) => {
        receivedBody = await request.json();
        return HttpResponse.json({ success: true });
      }),
    );

    await gateway.refund('A-7', 750);

    expect(receivedBody).toEqual({
      orderId: 'A-7',
      amount: 750,
    });
  });

  it('обробляє відмову повернення коштів', async () => {
    server.use(
      http.post(REFUND_URL, () => HttpResponse.json({ success: false })),
    );

    await expect(gateway.refund('A-1', 500)).resolves.toBe(false);
  });
});
