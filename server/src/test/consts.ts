import { Decimal } from '@prisma/client/runtime/library';
import type { TripResponseDto } from '../trips/dtos/trip-response.dto';
import type { VehicleResponseDto } from '../vehicles/dtos/vehicle-response.dto';
import type { VehicleSummaryDto } from '../vehicles/dtos/vehicle-summary.dto';

export const MOCK_VEHICLE_ID = '550e8400-e29b-41d4-a716-446655440000';
export const MOCK_VEHICLE_ID_2 = '550e8400-e29b-41d4-a716-446655440001';
export const MOCK_TRIP_ID = '550e8400-e29b-41d4-a716-446655440002';
export const INVALID_UUID = 'not-a-valid-uuid';

export const MOCK_VEHICLE_NAME = 'Test Vehicle';
export const MOCK_VEHICLE_LICENSE_PLATE = 'B-EX-001';

export const MOCK_TRIP_START = new Date('2024-06-01T08:00:00Z');
export const MOCK_TRIP_DURATION_MINUTES = 90;
export const MOCK_TRIP_END = new Date(MOCK_TRIP_START.getTime() + MOCK_TRIP_DURATION_MINUTES * 60_000);
export const MOCK_TRIP_DISTANCE_KM = 145.5;
export const MOCK_TRIP_FUEL_CONSUMED = 18.3;

export const MOCK_VEHICLE_CREATED_AT = new Date('2024-01-01T00:00:00Z');

export const MOCK_VEHICLE: VehicleResponseDto = {
  id: MOCK_VEHICLE_ID,
  name: MOCK_VEHICLE_NAME,
  licensePlate: MOCK_VEHICLE_LICENSE_PLATE,
  createdAt: MOCK_VEHICLE_CREATED_AT,
};

export const MOCK_TRIP = {
  id: MOCK_TRIP_ID,
  vehicleId: MOCK_VEHICLE_ID,
  startedAt: MOCK_TRIP_START,
  endedAt: MOCK_TRIP_END,
  durationMinutes: MOCK_TRIP_DURATION_MINUTES,
  distanceKm: new Decimal(MOCK_TRIP_DISTANCE_KM.toString()),
  fuelConsumed: new Decimal(MOCK_TRIP_FUEL_CONSUMED.toString()),
  createdAt: MOCK_TRIP_START,
};

export const MOCK_TRIP_RESPONSE: TripResponseDto = {
  id: MOCK_TRIP_ID,
  vehicleId: MOCK_VEHICLE_ID,
  startedAt: MOCK_TRIP_START,
  endedAt: MOCK_TRIP_END,
  durationMinutes: MOCK_TRIP_DURATION_MINUTES,
  distanceKm: MOCK_TRIP_DISTANCE_KM,
  fuelConsumed: MOCK_TRIP_FUEL_CONSUMED,
  createdAt: MOCK_TRIP_START,
};

export const MOCK_TRIP_COUNT = 3;
export const MOCK_TOTAL_DISTANCE_KM = 435.3;
export const MOCK_TOTAL_FUEL_CONSUMED = 54.9;
export const MOCK_AVG_DURATION_MINUTES = 90;

export const MOCK_VEHICLE_SUMMARY: VehicleSummaryDto = {
  vehicleId: MOCK_VEHICLE_ID,
  name: MOCK_VEHICLE_NAME,
  licensePlate: MOCK_VEHICLE_LICENSE_PLATE,
  tripCount: MOCK_TRIP_COUNT,
  totalDistanceKm: MOCK_TOTAL_DISTANCE_KM,
  totalFuelConsumed: MOCK_TOTAL_FUEL_CONSUMED,
  averageDurationMinutes: MOCK_AVG_DURATION_MINUTES,
};

const prismaClient = {
  vehicle: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  trip: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
};

export const prismaMock = {
  ...prismaClient,
  $transaction: jest.fn((cb: (prisma: typeof prismaClient) => Promise<unknown>) => cb(prismaClient)),
};
