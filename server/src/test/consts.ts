import { VehicleType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import type { VehicleSummary } from '../vehicles/types';

export const MOCK_VEHICLE_ID = '550e8400-e29b-41d4-a716-446655440000';
export const MOCK_VEHICLE_ID_2 = '550e8400-e29b-41d4-a716-446655440001';
export const MOCK_TRIP_ID = '550e8400-e29b-41d4-a716-446655440002';
export const INVALID_UUID = 'not-a-valid-uuid';

export const MOCK_VEHICLE = {
  id: MOCK_VEHICLE_ID,
  name: 'Test Vehicle',
  licensePlate: 'B-EX-001',
  type: VehicleType.TRUCK,
  createdAt: new Date('2024-01-01T00:00:00Z'),
};

export const MOCK_VEHICLE_RESPONSE = {
  id: MOCK_VEHICLE_ID,
  name: 'Test Vehicle',
  licensePlate: 'B-EX-001',
  type: VehicleType.TRUCK,
  createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
};

export const MOCK_TRIP = {
  id: MOCK_TRIP_ID,
  vehicleId: MOCK_VEHICLE_ID,
  startedAt: new Date('2024-06-01T08:00:00Z'),
  endedAt: new Date('2024-06-01T09:30:00Z'),
  durationMinutes: 90,
  distanceKm: new Decimal('145.5'),
  fuelConsumed: new Decimal('18.3'),
  createdAt: new Date('2024-06-01T08:00:00Z'),
};

export const MOCK_TRIP_RESPONSE = {
  id: MOCK_TRIP_ID,
  vehicleId: MOCK_VEHICLE_ID,
  startedAt: new Date('2024-06-01T08:00:00Z').toISOString(),
  endedAt: new Date('2024-06-01T09:30:00Z').toISOString(),
  durationMinutes: 90,
  distanceKm: 145.5,
  fuelConsumed: 18.3,
  createdAt: new Date('2024-06-01T08:00:00Z').toISOString(),
};

export const MOCK_VEHICLE_SUMMARY: VehicleSummary = {
  vehicleId: MOCK_VEHICLE_ID,
  name: 'Test Vehicle',
  licensePlate: 'B-EX-001',
  type: VehicleType.TRUCK,
  tripCount: 3,
  totalDistanceKm: 435.3,
  totalFuelConsumed: 54.9,
  averageDurationMinutes: 90,
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
