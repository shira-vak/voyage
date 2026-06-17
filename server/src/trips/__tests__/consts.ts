import { MOCK_TRIP_DISTANCE_KM, MOCK_TRIP_END, MOCK_TRIP_FUEL_CONSUMED, MOCK_TRIP_START } from '../../tests/consts';
import type { CreateTripDto } from '../dtos/create-trip.dto';
import type { ListTripsQueryDto } from '../dtos/list-trips-query.dto';

export const MOCK_LIST_TRIPS_QUERY: ListTripsQueryDto = { page: 1, limit: 20 };

export const MOCK_CREATE_TRIP_DTO: CreateTripDto = {
  startedAt: MOCK_TRIP_START,
  endedAt: MOCK_TRIP_END,
  distanceKm: MOCK_TRIP_DISTANCE_KM,
  fuelConsumed: MOCK_TRIP_FUEL_CONSUMED,
};
