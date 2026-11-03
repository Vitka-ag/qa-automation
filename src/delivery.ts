
const FREE_DELIVERY_THRESHOLD = 1000;
const BASE_WEIGHT_LIMIT = 5;
const BASE_DELIVERY_FEE = 50;
const EXTRA_KG_FEE = 10;
const MAX_DELIVERY_FEE = 300;

export function calcDeliveryFee(
  weight: number,
  orderAmount: number,
): number {
  if (orderAmount >= FREE_DELIVERY_THRESHOLD) return 0;

  if (weight <= BASE_WEIGHT_LIMIT) return BASE_DELIVERY_FEE;

  return Math.min(
    BASE_DELIVERY_FEE +
      Math.ceil(weight - BASE_WEIGHT_LIMIT) * EXTRA_KG_FEE,
    MAX_DELIVERY_FEE,
  );
}
