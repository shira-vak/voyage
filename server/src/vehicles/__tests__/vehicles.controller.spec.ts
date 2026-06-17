import { INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DecimalTransformInterceptor } from '../../common/decimal-transform.interceptor';
import { MOCK_VEHICLE, MOCK_VEHICLE_ID, MOCK_VEHICLE_LICENSE_PLATE, MOCK_VEHICLE_SUMMARY } from '../../tests/consts';
import { VehiclesController } from '../vehicles.controller';
import { VehiclesService } from '../vehicles.service';
import { MOCK_CREATE_VEHICLE_DTO } from './consts';

const serviceMock = {
  createVehicle: jest.fn(),
  listVehicles: jest.fn(),
  getVehicleByLicensePlate: jest.fn(),
  getVehicleSummary: jest.fn(),
};

describe('VehiclesController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [{ provide: VehiclesService, useValue: serviceMock }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalInterceptors(new DecimalTransformInterceptor());
    await app.init();
  });

  beforeEach(() => jest.clearAllMocks());
  afterAll(() => app.close());

  describe('POST /vehicles', () => {
    it('when data is valid should return 201 with the created vehicle', async () => {
      serviceMock.createVehicle.mockResolvedValue(MOCK_VEHICLE);

      const res = await request(app.getHttpServer()).post('/vehicles').send(MOCK_CREATE_VEHICLE_DTO).expect(201);

      expect(res.body.id).toBe(MOCK_VEHICLE_ID);
    });

    it.each([
      ['name is missing', { licensePlate: MOCK_VEHICLE.licensePlate }],
      ['licensePlate is missing', { name: MOCK_VEHICLE.name }],
      ['an unknown field is sent', { ...MOCK_CREATE_VEHICLE_DTO, extra: 'x' }],
    ])('when %s should return 400', async (_label, body) => {
      await request(app.getHttpServer()).post('/vehicles').send(body).expect(400);
    });
  });

  describe('GET /vehicles', () => {
    it('when vehicles exist should return 200 with the list', async () => {
      serviceMock.listVehicles.mockResolvedValue([MOCK_VEHICLE, MOCK_VEHICLE]);

      const res = await request(app.getHttpServer()).get('/vehicles').expect(200);

      expect(res.body).toHaveLength(2);
    });

    it('when no vehicles exist should return 200 with empty array', async () => {
      serviceMock.listVehicles.mockResolvedValue([]);

      const res = await request(app.getHttpServer()).get('/vehicles').expect(200);

      expect(res.body).toEqual([]);
    });
  });

  describe('GET /vehicles/:licensePlate', () => {
    it('when vehicle exists should return 200 with the vehicle', async () => {
      serviceMock.getVehicleByLicensePlate.mockResolvedValue(MOCK_VEHICLE);

      const res = await request(app.getHttpServer()).get(`/vehicles/${MOCK_VEHICLE_LICENSE_PLATE}`).expect(200);

      expect(res.body.id).toBe(MOCK_VEHICLE_ID);
      expect(res.body.licensePlate).toBe(MOCK_VEHICLE_LICENSE_PLATE);
    });

    it('when vehicle does not exist should return 404', async () => {
      serviceMock.getVehicleByLicensePlate.mockRejectedValue(new NotFoundException());

      await request(app.getHttpServer()).get(`/vehicles/${MOCK_VEHICLE_LICENSE_PLATE}`).expect(404);
    });
  });

  describe('GET /vehicles/:licensePlate/summary', () => {
    it('when vehicle exists should return 200 with summary', async () => {
      serviceMock.getVehicleSummary.mockResolvedValue(MOCK_VEHICLE_SUMMARY);

      const res = await request(app.getHttpServer()).get(`/vehicles/${MOCK_VEHICLE_LICENSE_PLATE}/summary`).expect(200);

      expect(res.body.vehicle.id).toBe(MOCK_VEHICLE_ID);
      expect(res.body.tripCount).toBe(MOCK_VEHICLE_SUMMARY.tripCount);
    });

    it('when vehicle does not exist should return 404', async () => {
      serviceMock.getVehicleSummary.mockRejectedValue(new NotFoundException());

      await request(app.getHttpServer()).get(`/vehicles/${MOCK_VEHICLE_LICENSE_PLATE}/summary`).expect(404);
    });
  });
});
