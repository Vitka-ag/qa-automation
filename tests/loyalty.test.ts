import { describe, it, expect } from 'vitest';
import { applyLoyaltyPoints } from '../src/order';

describe('applyLoyaltyPoints', () => {
  it.each([
    [1000, 0, 1000],
    [1000, 100, 900],
    [1000, 299, 701],
    [1000, 300, 700],
    [1000, 301, 700],
    [1000, 500, 700],
    [1000, 1000, 700],
    [100, 10, 90],
    [0, 0, 0],
  ])('сума %s, бонуси %s → до оплати %s', (total, points, expected) => {
    expect(applyLoyaltyPoints(total, points)).toBeCloseTo(expected, 2);
  });

  it('відхиляє від’ємну кількість бонусів', () => {
    expect(() => applyLoyaltyPoints(1000, -1)).toThrow('NEGATIVE_POINTS');
  });

  it('відхиляє від’ємну суму замовлення', () => {
    expect(() => applyLoyaltyPoints(-100, 10)).toThrow('INVALID_TOTAL');
  });

  it('відхиляє нецілу кількість бонусів', () => {
    expect(() => applyLoyaltyPoints(1000, 1.5)).toThrow('INVALID_POINTS');
  });

  it('відхиляє нескінченну суму замовлення', () => {
    expect(() => applyLoyaltyPoints(Infinity, 10)).toThrow('INVALID_TOTAL');
  });

  it('відхиляє нескінченну кількість бонусів', () => {
    expect(() => applyLoyaltyPoints(1000, Infinity)).toThrow('INVALID_POINTS');
  });
});
