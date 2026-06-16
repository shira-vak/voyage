import { MOCK_TRIP_DISTANCE_KM, MOCK_TRIP_END, MOCK_TRIP_FUEL_CONSUMED, MOCK_TRIP_START } from '../../test/consts';
import type { CreateTripDto } from '../dtos/create-trip.dto';

export const MOCK_CREATE_TRIP_DTO: CreateTripDto = {
  startedAt: MOCK_TRIP_START,
  endedAt: MOCK_TRIP_END,
  distanceKm: MOCK_TRIP_DISTANCE_KM,
  fuelConsumed: MOCK_TRIP_FUEL_CONSUMED,
};
