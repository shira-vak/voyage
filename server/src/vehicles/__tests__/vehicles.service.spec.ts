import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Prisma, VehicleType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../../prisma/prisma.service';
import { MOCK_VEHICLE, MOCK_VEHICLE_ID, prismaMock } from '../../test/consts';
import { VehiclesService } from '../vehicles.service';

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

      const result = await service.createVehicle({
        name: 'Test Vehicle',
        licensePlate: 'B-EX-001',
        type: VehicleType.TRUCK,
      });

      expect(prismaMock.vehicle.create).toHaveBeenCalledWith({
        data: { name: 'Test Vehicle', licensePlate: 'B-EX-001', type: VehicleType.TRUCK },
      });
      expect(result.id).toBe(MOCK_VEHICLE_ID);
    });

    it('when licence plate is already registered should throw BadRequestException', async () => {
      const p2002 = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.0.0',
      });
      prismaMock.vehicle.create.mockRejectedValue(p2002);

      await expect(
        service.createVehicle({ name: 'Test Vehicle', licensePlate: 'B-EX-001', type: VehicleType.TRUCK }),
      ).rejects.toThrow(BadRequestException);
    });

    it('when an unexpected error occurs should rethrow it', async () => {
      const unexpectedError = new Error('DB connection lost');
      prismaMock.vehicle.create.mockRejectedValue(unexpectedError);

      await expect(
        service.createVehicle({ name: 'Test Vehicle', licensePlate: 'B-EX-001', type: VehicleType.TRUCK }),
      ).rejects.toThrow('DB connection lost');
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

  describe('getVehicleById', () => {
    it('when vehicle exists should return it', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(MOCK_VEHICLE);

      const result = await service.getVehicleById(MOCK_VEHICLE_ID);

      expect(result.id).toBe(MOCK_VEHICLE_ID);
    });

    it('when vehicle does not exist should throw NotFoundException', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.getVehicleById(MOCK_VEHICLE_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getVehicleSummary', () => {
    it('when vehicle has trips should return aggregated summary', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(MOCK_VEHICLE);
      prismaMock.trip.count.mockResolvedValue(3);
      prismaMock.trip.aggregate.mockResolvedValue({
        _sum: { distanceKm: new Decimal('435.3'), fuelConsumed: new Decimal('54.9') },
        _avg: { durationMinutes: 90.0 },
      });

      const result = await service.getVehicleSummary(MOCK_VEHICLE_ID);

      expect(result.vehicleId).toBe(MOCK_VEHICLE_ID);
      expect(result.tripCount).toBe(3);
      expect(result.totalDistanceKm).toBe(435.3);
      expect(result.totalFuelConsumed).toBe(54.9);
      expect(result.averageDurationMinutes).toBe(90);
    });

    it('when vehicle has no trips should return zero aggregates', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(MOCK_VEHICLE);
      prismaMock.trip.count.mockResolvedValue(0);
      prismaMock.trip.aggregate.mockResolvedValue({
        _sum: { distanceKm: null, fuelConsumed: null },
        _avg: { durationMinutes: null },
      });

      const result = await service.getVehicleSummary(MOCK_VEHICLE_ID);

      expect(result.tripCount).toBe(0);
      expect(result.totalDistanceKm).toBe(0);
      expect(result.totalFuelConsumed).toBe(0);
      expect(result.averageDurationMinutes).toBe(0);
    });

    it('when vehicle does not exist should throw NotFoundException', async () => {
      prismaMock.vehicle.findUnique.mockResolvedValue(null);

      await expect(service.getVehicleSummary(MOCK_VEHICLE_ID)).rejects.toThrow(NotFoundException);
    });
  });
});
