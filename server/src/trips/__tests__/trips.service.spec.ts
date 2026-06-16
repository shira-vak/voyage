import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import {
  MOCK_TRIP,
  MOCK_TRIP_DISTANCE_KM,
  MOCK_TRIP_DURATION_MINUTES,
  MOCK_TRIP_END,
  MOCK_TRIP_FUEL_CONSUMED,
  MOCK_TRIP_ID,
  MOCK_TRIP_START,
  MOCK_VEHICLE,
  MOCK_VEHICLE_ID,
  prismaMock,
} from '../../test/consts';
import { VehiclesService } from '../../vehicles/vehicles.service';
import { TripsService } from '../trips.service';
import { MOCK_CREATE_TRIP_DTO, MOCK_LIST_TRIPS_QUERY } from './consts';

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
    it('when vehicle exists and data is valid should create and return the trip', async () => {
      vehiclesServiceMock.getVehicleById.mockResolvedValue(MOCK_VEHICLE);
      prismaMock.trip.create.mockResolvedValue(MOCK_TRIP);

      const result = await service.createTrip(MOCK_VEHICLE_ID, MOCK_CREATE_TRIP_DTO);

      expect(prismaMock.trip.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            vehicleId: MOCK_VEHICLE_ID,
            durationMinutes: MOCK_TRIP_DURATION_MINUTES,
          }),
        }),
      );
      expect(result.tripId).toBe(MOCK_TRIP_ID);
      expect(result.distanceKm).toBe(MOCK_TRIP_DISTANCE_KM);
      expect(result.fuelConsumed).toBe(MOCK_TRIP_FUEL_CONSUMED);
    });

    it('when vehicle does not exist should throw NotFoundException', async () => {
      vehiclesServiceMock.getVehicleById.mockRejectedValue(new NotFoundException());

      await expect(service.createTrip(MOCK_VEHICLE_ID, MOCK_CREATE_TRIP_DTO)).rejects.toThrow(NotFoundException);
    });

    it('when startedAt is equal to endedAt should throw BadRequestException', async () => {
      vehiclesServiceMock.getVehicleById.mockResolvedValue(MOCK_VEHICLE);

      await expect(
        service.createTrip(MOCK_VEHICLE_ID, {
          ...MOCK_CREATE_TRIP_DTO,
          startedAt: MOCK_TRIP_START,
          endedAt: MOCK_TRIP_START,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('when startedAt is after endedAt should throw BadRequestException', async () => {
      vehiclesServiceMock.getVehicleById.mockResolvedValue(MOCK_VEHICLE);

      await expect(
        service.createTrip(MOCK_VEHICLE_ID, {
          ...MOCK_CREATE_TRIP_DTO,
          startedAt: MOCK_TRIP_END,
          endedAt: MOCK_TRIP_START,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should compute durationMinutes correctly and map Decimals to numbers', async () => {
      vehiclesServiceMock.getVehicleById.mockResolvedValue(MOCK_VEHICLE);
      prismaMock.trip.create.mockResolvedValue(MOCK_TRIP);

      const result = await service.createTrip(MOCK_VEHICLE_ID, MOCK_CREATE_TRIP_DTO);

      expect(prismaMock.trip.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ durationMinutes: MOCK_TRIP_DURATION_MINUTES }) }),
      );
      expect(typeof result.distanceKm).toBe('number');
      expect(typeof result.fuelConsumed).toBe('number');
    });
  });

  describe('listTrips', () => {
    it('when no filters are applied should return all trips paginated with defaults', async () => {
      prismaMock.trip.findMany.mockResolvedValue([MOCK_TRIP]);
      prismaMock.trip.count.mockResolvedValue(1);

      const result = await service.listTrips(MOCK_LIST_TRIPS_QUERY);

      expect(result.data).toHaveLength(1);
      expect(result.totalTrips).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('when vehicleId filter is applied should pass it to the where clause', async () => {
      prismaMock.trip.findMany.mockResolvedValue([MOCK_TRIP]);
      prismaMock.trip.count.mockResolvedValue(1);

      await service.listTrips({ ...MOCK_LIST_TRIPS_QUERY, vehicleId: MOCK_VEHICLE_ID });

      expect(prismaMock.trip.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ vehicleId: MOCK_VEHICLE_ID }) }),
      );
    });

    it('when date range filter is applied should pass it to the where clause', async () => {
      prismaMock.trip.findMany.mockResolvedValue([MOCK_TRIP]);
      prismaMock.trip.count.mockResolvedValue(1);

      await service.listTrips({ ...MOCK_LIST_TRIPS_QUERY, startDate: MOCK_TRIP_START, endDate: MOCK_TRIP_END });

      expect(prismaMock.trip.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ startedAt: { gte: MOCK_TRIP_START, lte: MOCK_TRIP_END } }),
        }),
      );
    });

    it('when custom pagination is applied should use page and limit', async () => {
      const page = 2;
      const limit = 10;
      const totalTrips = 50;
      prismaMock.trip.findMany.mockResolvedValue([MOCK_TRIP]);
      prismaMock.trip.count.mockResolvedValue(totalTrips);

      const result = await service.listTrips({ ...MOCK_LIST_TRIPS_QUERY, page, limit });

      expect(prismaMock.trip.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: (page - 1) * limit, take: limit }),
      );
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.totalTrips).toBe(totalTrips);
    });

    it('when no trips match should return empty data with total zero', async () => {
      prismaMock.trip.findMany.mockResolvedValue([]);
      prismaMock.trip.count.mockResolvedValue(0);

      const result = await service.listTrips({ ...MOCK_LIST_TRIPS_QUERY, vehicleId: MOCK_VEHICLE_ID });

      expect(result.data).toEqual([]);
      expect(result.totalTrips).toBe(0);
    });

    it('should map Decimal fields to numbers in returned trips', async () => {
      prismaMock.trip.findMany.mockResolvedValue([MOCK_TRIP]);
      prismaMock.trip.count.mockResolvedValue(1);

      const result = await service.listTrips(MOCK_LIST_TRIPS_QUERY);

      expect(result.data[0].distanceKm).toBe(MOCK_TRIP_DISTANCE_KM);
      expect(result.data[0].fuelConsumed).toBe(MOCK_TRIP_FUEL_CONSUMED);
      expect(typeof result.data[0].distanceKm).toBe('number');
    });
  });
});
