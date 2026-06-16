import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { MOCK_TRIP, MOCK_VEHICLE, MOCK_VEHICLE_ID, prismaMock } from '../../test/consts';
import { VehiclesService } from '../../vehicles/vehicles.service';
import { TripsService } from '../trips.service';

const vehiclesServiceMock = {
  getVehicleById: jest.fn(),
};

describe('TripsService', () => {
  let service: TripsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: VehiclesService, useValue: vehiclesServiceMock },
      ],
    }).compile();

    service = module.get(TripsService);
    jest.clearAllMocks();
  });

  describe('createTrip', () => {
    const validDto = {
      startedAt: '2024-06-01T08:00:00Z',
      endedAt: '2024-06-01T09:30:00Z',
      distanceKm: 145.5,
      fuelConsumed: 18.3,
    };

    it('when vehicle exists and data is valid should create and return the trip', async () => {
      vehiclesServiceMock.getVehicleById.mockResolvedValue(MOCK_VEHICLE);
      prismaMock.trip.create.mockResolvedValue(MOCK_TRIP);

      const result = await service.createTrip(MOCK_VEHICLE_ID, validDto);

      expect(prismaMock.trip.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            vehicleId: MOCK_VEHICLE_ID,
            durationMinutes: 90,
          }),
        }),
      );
      expect(result.id).toBe(MOCK_TRIP.id);
    });

    it('when vehicle does not exist should throw NotFoundException', async () => {
      vehiclesServiceMock.getVehicleById.mockRejectedValue(new NotFoundException());

      await expect(service.createTrip(MOCK_VEHICLE_ID, validDto)).rejects.toThrow(NotFoundException);
    });

    it('when startedAt is equal to endedAt should throw BadRequestException', async () => {
      vehiclesServiceMock.getVehicleById.mockResolvedValue(MOCK_VEHICLE);

      await expect(
        service.createTrip(MOCK_VEHICLE_ID, {
          ...validDto,
          startedAt: '2024-06-01T08:00:00Z',
          endedAt: '2024-06-01T08:00:00Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('when startedAt is after endedAt should throw BadRequestException', async () => {
      vehiclesServiceMock.getVehicleById.mockResolvedValue(MOCK_VEHICLE);

      await expect(
        service.createTrip(MOCK_VEHICLE_ID, {
          ...validDto,
          startedAt: '2024-06-01T10:00:00Z',
          endedAt: '2024-06-01T08:00:00Z',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should compute durationMinutes correctly', async () => {
      vehiclesServiceMock.getVehicleById.mockResolvedValue(MOCK_VEHICLE);
      prismaMock.trip.create.mockResolvedValue(MOCK_TRIP);

      await service.createTrip(MOCK_VEHICLE_ID, {
        startedAt: '2024-06-01T08:00:00Z',
        endedAt: '2024-06-01T09:30:00Z',
        distanceKm: 100,
        fuelConsumed: 10,
      });

      expect(prismaMock.trip.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ durationMinutes: 90 }) }),
      );
    });
  });

  describe('listTrips', () => {
    it('when no filters are applied should return all trips paginated', async () => {
      prismaMock.trip.findMany.mockResolvedValue([MOCK_TRIP]);
      prismaMock.trip.count.mockResolvedValue(1);

      const result = await service.listTrips({});

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('when vehicleId filter is applied should pass it to the where clause', async () => {
      prismaMock.trip.findMany.mockResolvedValue([MOCK_TRIP]);
      prismaMock.trip.count.mockResolvedValue(1);

      await service.listTrips({ vehicleId: MOCK_VEHICLE_ID });

      expect(prismaMock.trip.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ vehicleId: MOCK_VEHICLE_ID }) }),
      );
    });

    it('when date range filter is applied should pass it to the where clause', async () => {
      prismaMock.trip.findMany.mockResolvedValue([MOCK_TRIP]);
      prismaMock.trip.count.mockResolvedValue(1);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      await service.listTrips({ startDate, endDate });

      expect(prismaMock.trip.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ startedAt: { gte: startDate, lte: endDate } }),
        }),
      );
    });

    it('when custom pagination is applied should use page and limit', async () => {
      prismaMock.trip.findMany.mockResolvedValue([MOCK_TRIP]);
      prismaMock.trip.count.mockResolvedValue(50);

      const result = await service.listTrips({ page: 2, limit: 10 });

      expect(prismaMock.trip.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 10, take: 10 }));
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
    });

    it('when no trips match should return empty data with total zero', async () => {
      prismaMock.trip.findMany.mockResolvedValue([]);
      prismaMock.trip.count.mockResolvedValue(0);

      const result = await service.listTrips({ vehicleId: MOCK_VEHICLE_ID });

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
