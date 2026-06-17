import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../../prisma/prisma.service';
import {
  MOCK_AVG_DURATION_MINUTES,
  MOCK_TOTAL_DISTANCE_KM,
  MOCK_TOTAL_FUEL_CONSUMED,
  MOCK_TRIP_COUNT,
  MOCK_VEHICLE,
  MOCK_VEHICLE_ID,
  MOCK_VEHICLE_LICENSE_PLATE,
  MOCK_VEHICLE_NAME,
  prismaMock,
} from '../../tests/consts';
import { VehiclesService } from '../vehicles.service';
import { MOCK_CREATE_VEHICLE_DTO } from './consts';

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VehiclesService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get(VehiclesService);
    jest.clearAllMocks();
  });

  describe('createVehicle', () => {
    it('when data is valid should create and return the vehicle', async () => {
      prismaMock.vehicle.create.mockResolvedValue(MOCK_VEHICLE);

      const result = await service.createVehicle(MOCK_CREATE_VEHICLE_DTO);

      expect(prismaMock.vehicle.create).toHaveBeenCalledWith({
        data: { name: MOCK_VEHICLE_NAME, licensePlate: MOCK_VEHICLE_LICENSE_PLATE },
      });
      expect(result.id).toBe(MOCK_VEHICLE_ID);
    });

    it('when licence plate is already registered should throw BadRequestException', async () => {
      const p2002 = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
      });
      prismaMock.vehicle.create.mockRejectedValue(p2002);

      await expect(service.createVehicle(MOCK_CREATE_VEHICLE_DTO)).rejects.toThrow(BadRequestException);
    });

    it('when an unexpected error occurs should rethrow it', async () => {
      const unexpectedError = new Error('DB connection lost');
      prismaMock.vehicle.create.mockRejectedValue(unexpectedError);

      await expect(service.createVehicle(MOCK_CREATE_VEHICLE_DTO)).rejects.toThrow('DB connection lost');
    });
  });

  describe('listVehicles', () => {
    it.each([
      { count: 1, vehicles: [MOCK_VEHICLE] },
      { count: 3, vehicles: [MOCK_VEHICLE, MOCK_VEHICLE, MOCK_VEHICLE] },
    ])('when $count vehicle(s) exist should return them all', async ({ vehicles }) => {
      prismaMock.vehicle.findMany.mockResolvedValue(vehicles);

      const result = await service.listVehicles();

      expect(result).toHaveLength(vehicles.length);
    });

    it('when no vehicles exist should return empty array', async () => {
      prismaMock.vehicle.findMany.mockResolvedValue([]);

      const result = await service.listVehicles();

      expect(result).toEqual([]);
    });
  });

  describe('getVehicleByLicensePlate', () => {
    it('when vehicle exists should return it', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(MOCK_VEHICLE);

      const result = await service.getVehicleByLicensePlate(MOCK_VEHICLE_LICENSE_PLATE);

      expect(result.licensePlate).toBe(MOCK_VEHICLE_LICENSE_PLATE);
    });

    it('when vehicle does not exist should throw NotFoundException', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.getVehicleByLicensePlate(MOCK_VEHICLE_LICENSE_PLATE)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getVehicleSummary', () => {
    it('when vehicle has trips should return aggregated summary', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(MOCK_VEHICLE);
      prismaMock.trip.count.mockResolvedValue(MOCK_TRIP_COUNT);
      prismaMock.trip.aggregate.mockResolvedValue({
        _sum: {
          distanceKm: new Decimal(MOCK_TOTAL_DISTANCE_KM.toString()),
          fuelConsumed: new Decimal(MOCK_TOTAL_FUEL_CONSUMED.toString()),
        },
        _avg: { durationMinutes: MOCK_AVG_DURATION_MINUTES },
      });

      const result = await service.getVehicleSummary(MOCK_VEHICLE_LICENSE_PLATE);

      expect(result.vehicle.id).toBe(MOCK_VEHICLE_ID);
      expect(result.tripCount).toBe(MOCK_TRIP_COUNT);
      expect(result.totalDistanceKm).toBe(MOCK_TOTAL_DISTANCE_KM);
      expect(result.totalFuelConsumed).toBe(MOCK_TOTAL_FUEL_CONSUMED);
      expect(result.averageDurationMinutes).toBe(MOCK_AVG_DURATION_MINUTES);
    });

    it('when vehicle has no trips should return zero aggregates', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(MOCK_VEHICLE);
      prismaMock.trip.count.mockResolvedValue(0);
      prismaMock.trip.aggregate.mockResolvedValue({
        _sum: { distanceKm: null, fuelConsumed: null },
        _avg: { durationMinutes: null },
      });

      const result = await service.getVehicleSummary(MOCK_VEHICLE_LICENSE_PLATE);

      expect(result.tripCount).toBe(0);
      expect(result.totalDistanceKm).toBe(0);
      expect(result.totalFuelConsumed).toBe(0);
      expect(result.averageDurationMinutes).toBe(0);
    });

    it('when vehicle does not exist should throw NotFoundException', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.getVehicleSummary(MOCK_VEHICLE_LICENSE_PLATE)).rejects.toThrow(NotFoundException);
    });
  });
});
