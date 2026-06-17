import type { Dayjs } from 'dayjs';

export interface TripsQuery {
  licensePlate?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface TripFormValues {
  licensePlate: string;
  dateRange: [Dayjs, Dayjs];
  distanceKm: number;
  fuelConsumed: number;
}
