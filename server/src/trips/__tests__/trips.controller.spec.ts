import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DecimalTransformInterceptor } from '../../common/decimal-transform.interceptor';
import { INVALID_UUID, MOCK_TRIP_RESPONSE, MOCK_VEHICLE_ID } from '../../test/consts';
import { TripsController } from '../trips.controller';
import { TripsService } from '../trips.service';

const serviceMock = {
  createTrip: jest.fn(),
  listTrips: jest.fn(),
};

const validTripBody = {
  startedAt: '2024-06-01T08:00:00Z',
  endedAt: '2024-06-01T09:30:00Z',
  distanceKm: 145.5,
  fuelConsumed: 18.3,
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

  describe('POST /vehicles/:vehicleId/trips', () => {
    it('when data is valid should return 201 with the created trip', async () => {
      serviceMock.createTrip.mockResolvedValue(MOCK_TRIP_RESPONSE);

      const res = await request(app.getHttpServer())
        .post(`/vehicles/${MOCK_VEHICLE_ID}/trips`)
        .send(validTripBody)
        .expect(201);

      expect(res.body.vehicleId).toBe(MOCK_VEHICLE_ID);
      expect(res.body.distanceKm).toBe(145.5);
    });

    it('when vehicle does not exist should return 404', async () => {
      serviceMock.createTrip.mockRejectedValue(new NotFoundException());

      await request(app.getHttpServer()).post(`/vehicles/${MOCK_VEHICLE_ID}/trips`).send(validTripBody).expect(404);
    });

    it('when vehicleId is not a valid UUID should return 400', async () => {
      await request(app.getHttpServer()).post(`/vehicles/${INVALID_UUID}/trips`).send(validTripBody).expect(400);
    });

    it.each([
      ['startedAt is missing', { endedAt: '2024-06-01T09:30:00Z', distanceKm: 145.5, fuelConsumed: 18.3 }],
      ['endedAt is missing', { startedAt: '2024-06-01T08:00:00Z', distanceKm: 145.5, fuelConsumed: 18.3 }],
      ['distanceKm is zero', { ...validTripBody, distanceKm: 0 }],
      ['fuelConsumed is negative', { ...validTripBody, fuelConsumed: -5 }],
      ['startedAt is not a date string', { ...validTripBody, startedAt: 'not-a-date' }],
      ['an unknown field is sent', { ...validTripBody, extra: 'x' }],
    ])('when %s should return 400', async (_label, body) => {
      await request(app.getHttpServer()).post(`/vehicles/${MOCK_VEHICLE_ID}/trips`).send(body).expect(400);
    });
  });

  describe('GET /trips', () => {
    it('when no filters are applied should return 200 with paginated result', async () => {
      serviceMock.listTrips.mockResolvedValue({ data: [MOCK_TRIP_RESPONSE], total: 1, page: 1, limit: 20 });

      const res = await request(app.getHttpServer()).get('/trips').expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.total).toBe(1);
      expect(res.body.page).toBe(1);
    });

    it('when vehicleId filter is applied should return 200', async () => {
      serviceMock.listTrips.mockResolvedValue({ data: [MOCK_TRIP_RESPONSE], total: 1, page: 1, limit: 20 });

      const res = await request(app.getHttpServer()).get(`/trips?vehicleId=${MOCK_VEHICLE_ID}`).expect(200);

      expect(res.body.data).toHaveLength(1);
    });

    it('when no trips match should return 200 with empty data', async () => {
      serviceMock.listTrips.mockResolvedValue({ data: [], total: 0, page: 1, limit: 20 });

      const res = await request(app.getHttpServer()).get('/trips').expect(200);

      expect(res.body.data).toEqual([]);
      expect(res.body.total).toBe(0);
    });

    it('when page is 0 should return 400', async () => {
      await request(app.getHttpServer()).get('/trips?page=0').expect(400);
    });

    it('when limit exceeds 100 should return 400', async () => {
      await request(app.getHttpServer()).get('/trips?limit=101').expect(400);
    });

    it('when vehicleId is not a valid UUID should return 400', async () => {
      await request(app.getHttpServer()).get(`/trips?vehicleId=${INVALID_UUID}`).expect(400);
    });
  });
});
