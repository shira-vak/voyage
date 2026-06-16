import type { VehicleType } from '@prisma/client';

export type VehicleSummary = {
  vehicleId: string;
  name: string;
  licensePlate: string;
  type: VehicleType;
  tripCount: number;
  totalDistanceKm: number;
  totalFuelConsumed: number;
  averageDurationMinutes: number;
};
