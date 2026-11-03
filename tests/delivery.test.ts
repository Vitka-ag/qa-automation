
import { describe, expect, it } from 'vitest';
import { calcDeliveryFee } from '../src/delivery';

describe('calcDeliveryFee', () => {
    it.each([
    { weight: 1, expected: 50 },
    { weight: 5, expected: 50 },
    ])(
    'базова доставка для $weight кг коштує $expected грн',
    ({ weight, expected }) => {
        expect(calcDeliveryFee(weight, 500)).toBe(expected);
    },
    );
  
    it.each([
    { weight: 5, expected: 50 },
    { weight: 5.01, expected: 60 },
    { weight: 6, expected: 60 },
    { weight: 6.01, expected: 70 },
    { weight: 7, expected: 70 },
    ])(
    'доставка для $weight кг коштує $expected грн',
    ({ weight, expected }) => {
        expect(calcDeliveryFee(weight, 500)).toBe(expected);
    },
    );

});
