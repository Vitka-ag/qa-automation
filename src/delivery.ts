const FREE_DELIVERY_THRESHOLD = 1000;
const BASE_WEIGHT_LIMIT = 5;
const BASE_DELIVERY_FEE = 50;
const EXTRA_KG_FEE = 10;
const MAX_DELIVERY_FEE = 300;
const EXPRESS_MULTIPLIER = 2;

export interface DeliveryOptions {
  express?: boolean;
}

function assertValidInput(weight: number, orderAmount: number): void {
  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error('INVALID_WEIGHT');
  }

  if (!Number.isFinite(orderAmount) || orderAmount < 0) {
    throw new Error('INVALID_ORDER_AMOUNT');
  }
}

function calcBaseFee(weight: number): number {
  if (weight <= BASE_WEIGHT_LIMIT) {
    return BASE_DELIVERY_FEE;
  }

  const extraKg = Math.ceil(weight - BASE_WEIGHT_LIMIT);

  return Math.min(BASE_DELIVERY_FEE + extraKg * EXTRA_KG_FEE, MAX_DELIVERY_FEE);
}

export function calcDeliveryFee(
  weight: number,
  orderAmount: number,
  options: DeliveryOptions = {},
): number {
  assertValidInput(weight, orderAmount);

  if (orderAmount >= FREE_DELIVERY_THRESHOLD) {
    return 0;
  }

  const baseFee = calcBaseFee(weight);

  return options.express ? baseFee * EXPRESS_MULTIPLIER : baseFee;
}
