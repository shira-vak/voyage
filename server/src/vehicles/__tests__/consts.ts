import { MOCK_VEHICLE_LICENSE_PLATE, MOCK_VEHICLE_NAME } from '../../tests/consts';
import type { CreateVehicleDto } from '../dtos/create-vehicle.dto';

export const MOCK_CREATE_VEHICLE_DTO: CreateVehicleDto = {
  name: MOCK_VEHICLE_NAME,
  licensePlate: MOCK_VEHICLE_LICENSE_PLATE,
};
