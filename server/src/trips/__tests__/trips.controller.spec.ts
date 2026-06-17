import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DecimalTransformInterceptor } from '../../common/decimal-transform.interceptor';
import { MOCK_TRIP_DISTANCE_KM, MOCK_TRIP_RESPONSE, MOCK_VEHICLE_LICENSE_PLATE } from '../../tests/consts';
import { TripsController } from '../trips.controller';
import { TripsService } from '../trips.service';
import { MOCK_CREATE_TRIP_DTO } from './consts';

const serviceMock = {
  createTrip: jest.fn(),
  listTrips: jest.fn(),
};

describe('TripsController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [{ provide: TripsService, useValue: serviceMock }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalInterceptors(new DecimalTransformInterceptor());
    await app.init();
  });

  beforeEach(() => jest.clearAllMocks());
  afterAll(() => app.close());

  describe('POST /trips/:licensePlate', () => {
    it('when data is valid should return 201 with the created trip', async () => {
      serviceMock.createTrip.mockResolvedValue(MOCK_TRIP_RESPONSE);

      const res = await request(app.getHttpServer())
        .post(`/trips/${MOCK_VEHICLE_LICENSE_PLATE}`)
        .send(MOCK_CREATE_TRIP_DTO)
        .expect(201);

      expect(res.body.vehicleId).toBe(MOCK_TRIP_RESPONSE.vehicleId);
      expect(res.body.distanceKm).toBe(MOCK_TRIP_DISTANCE_KM);
    });

    it('when vehicle does not exist should return 404', async () => {
      serviceMock.createTrip.mockRejectedValue(new NotFoundException());

      await request(app.getHttpServer())
        .post(`/trips/${MOCK_VEHICLE_LICENSE_PLATE}`)
        .send(MOCK_CREATE_TRIP_DTO)
        .expect(404);
    });

    it.each([
      [
        'startedAt is missing',
        {
          endedAt: MOCK_CREATE_TRIP_DTO.endedAt,
          distanceKm: MOCK_TRIP_DISTANCE_KM,
          fuelConsumed: MOCK_TRIP_RESPONSE.fuelConsumed,
        },
      ],
      [
        'endedAt is missing',
        {
          startedAt: MOCK_CREATE_TRIP_DTO.startedAt,
          distanceKm: MOCK_TRIP_DISTANCE_KM,
          fuelConsumed: MOCK_TRIP_RESPONSE.fuelConsumed,
        },
      ],
      ['distanceKm is zero', { ...MOCK_CREATE_TRIP_DTO, distanceKm: 0 }],
      ['fuelConsumed is negative', { ...MOCK_CREATE_TRIP_DTO, fuelConsumed: -5 }],
      ['startedAt is not a date string', { ...MOCK_CREATE_TRIP_DTO, startedAt: 'not-a-date' }],
      ['an unknown field is sent', { ...MOCK_CREATE_TRIP_DTO, extra: 'x' }],
    ])('when %s should return 400', async (_label, body) => {
      await request(app.getHttpServer()).post(`/trips/${MOCK_VEHICLE_LICENSE_PLATE}`).send(body).expect(400);
    });
  });

  describe('GET /trips', () => {
    it('when no filters are applied should return 200 with paginated result', async () => {
      const totalTrips = 1;
      const page = 1;
      const limit = 20;
      serviceMock.listTrips.mockResolvedValue({ data: [MOCK_TRIP_RESPONSE], totalTrips, page, limit });

      const res = await request(app.getHttpServer()).get('/trips').expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.totalTrips).toBe(totalTrips);
      expect(res.body.page).toBe(page);
    });

    it('when licensePlate filter is applied should return 200', async () => {
      serviceMock.listTrips.mockResolvedValue({ data: [MOCK_TRIP_RESPONSE], totalTrips: 1, page: 1, limit: 20 });

      const res = await request(app.getHttpServer())
        .get(`/trips?licensePlate=${MOCK_VEHICLE_LICENSE_PLATE}`)
        .expect(200);

      expect(res.body.data).toHaveLength(1);
    });

    it('when no trips match should return 200 with empty data', async () => {
      serviceMock.listTrips.mockResolvedValue({ data: [], totalTrips: 0, page: 1, limit: 20 });

      const res = await request(app.getHttpServer()).get('/trips').expect(200);

      expect(res.body.data).toEqual([]);
      expect(res.body.totalTrips).toBe(0);
    });

    it('when page is 0 should return 400', async () => {
      await request(app.getHttpServer()).get('/trips?page=0').expect(400);
    });

    it('when limit exceeds 100 should return 400', async () => {
      await request(app.getHttpServer()).get('/trips?limit=101').expect(400);
    });
  });
});
