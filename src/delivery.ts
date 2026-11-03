
export function calcDeliveryFee(
  weight: number,
  orderAmount: number,
): number {
  if (orderAmount >= 1000) return 0;

  if (weight <= 5) return 50;

  return 50 + Math.ceil(weight - 5) * 10;
}
