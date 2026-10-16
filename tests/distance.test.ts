import { describe, it, expect } from 'vitest';
import { kilometersToMiles, milesToKilometers } from '../src/distance';

describe('Конвертація відстані', () => {
  it('перетворює 1 км у милі', () => {
    expect(kilometersToMiles(1)).toBeCloseTo(0.621371);
  });

  it('перетворює 1 милю у кілометри', () => {
    expect(milesToKilometers(1)).toBeCloseTo(1.609344);
  });

  it('дозволяє нульову відстань', () => {
    expect(kilometersToMiles(0)).toBe(0);
    expect(milesToKilometers(0)).toBe(0);
  });

  it('відхиляє від’ємну відстань', () => {
    expect(() => kilometersToMiles(-1)).toThrow('INVALID_DISTANCE');
    expect(() => milesToKilometers(-1)).toThrow('INVALID_DISTANCE');
  });

  it('відхиляє нескінченне значення', () => {
    expect(() => kilometersToMiles(Infinity)).toThrow('INVALID_DISTANCE');
  });
});
