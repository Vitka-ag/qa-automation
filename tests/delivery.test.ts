
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
    
    it.each([
        { orderAmount: 999.99, expected: 50 },
        { orderAmount: 1000, expected: 0 },
        { orderAmount: 1000.01, expected: 0 },
    ])(
    'доставка для замовлення на $orderAmount грн коштує $expected грн',
    ({ orderAmount, expected }) => {
        expect(calcDeliveryFee(5, orderAmount)).toBe(expected);
    },
    );

    it.each([
    { weight: 29, expected: 290 },
    { weight: 30, expected: 300 },
    { weight: 30.01, expected: 300 },
    { weight: 31, expected: 300 },
    ])(
    'обмежує вартість доставки для $weight кг до $expected грн',
    ({ weight, expected }) => {
        expect(calcDeliveryFee(weight, 500)).toBe(expected);
    },
    );

    it.each([
        { weight: 5, expected: 100 },
        { weight: 6, expected: 120 },
        { weight: 7, expected: 140 },
    ])(
    'експрес-доставка для $weight кг коштує $expected грн',
    ({ weight, expected }) => {
        expect(
        calcDeliveryFee(weight, 500, { express: true }),
        ).toBe(expected);
    },
    );

    it.each([
    { amount: -1 },
    { amount: NaN },
    { amount: Infinity },
    ])(
    'відхиляє некоректну суму замовлення $amount',
    ({ amount }) => {
        expect(() => calcDeliveryFee(5, amount))
        .toThrow('INVALID_ORDER_AMOUNT');
    },
    );
    
    it.each([
    { weight: -1 },
    { weight: 0 },
    { weight: NaN },
    { weight: Infinity },
    ])(
    'відхиляє некоректну вагу $weight',
    ({ weight }) => {
        expect(() => calcDeliveryFee(weight, 500))
        .toThrow('INVALID_WEIGHT');
    },
    );

});
