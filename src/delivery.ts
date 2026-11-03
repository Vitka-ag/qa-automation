
const FREE_DELIVERY_THRESHOLD = 1000;
const BASE_WEIGHT_LIMIT = 5;
const BASE_DELIVERY_FEE = 50;
const EXTRA_KG_FEE = 10;
const MAX_DELIVERY_FEE = 300;

export interface DeliveryOptions {
  express?: boolean;
}

export function calcDeliveryFee(
  weight: number,
  orderAmount: number,
  options: DeliveryOptions = {},
): number {
  if (orderAmount >= FREE_DELIVERY_THRESHOLD) return 0;

  const baseFee =
    weight <= BASE_WEIGHT_LIMIT
      ? BASE_DELIVERY_FEE
      : Math.min(
          BASE_DELIVERY_FEE +
            Math.ceil(weight - BASE_WEIGHT_LIMIT) * EXTRA_KG_FEE,
          MAX_DELIVERY_FEE,
        );

  return options.express ? baseFee * 2 : baseFee;
}
