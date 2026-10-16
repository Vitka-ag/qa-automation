import { describe, it, expect } from 'vitest';
import { celsiusToFahrenheit } from '../src/temperature';

describe('celsiusToFahrenheit', () => {
  it('перетворює 0°C на 32°F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it('перетворює 100°C на 212°F', () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it('працює з від’ємними значеннями', () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  it('відхиляє нечислове значення', () => {
    expect(() => celsiusToFahrenheit(NaN)).toThrow('INVALID_TEMPERATURE');
  });
});
