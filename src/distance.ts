const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1.609344;

function validateDistance(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('INVALID_DISTANCE');
  }
}

export function kilometersToMiles(kilometers: number): number {
  validateDistance(kilometers);
  return kilometers * KM_TO_MILES;
}

export function milesToKilometers(miles: number): number {
  validateDistance(miles);
  return miles * MILES_TO_KM;
}
