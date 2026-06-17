import { api } from './client';
import type { CreateTripRequest, ListTripsQuery, PaginatedTripsResponse, TripResponse } from './types';

export const tripsApi = {
  list: (query: ListTripsQuery): Promise<PaginatedTripsResponse> => {
    const params = new URLSearchParams();
    if (query.vehicleId) params.set('vehicleId', query.vehicleId);
    if (query.startDate) params.set('startDate', query.startDate);
    if (query.endDate) params.set('endDate', query.endDate);
    if (query.page != null) params.set('page', String(query.page));
    if (query.limit != null) params.set('limit', String(query.limit));

    const qs = params.toString();
    return api.get(`/trips${qs ? `?${qs}` : ''}`);
  },

  create: (vehicleId: string, body: CreateTripRequest): Promise<TripResponse> =>
    api.post(`/vehicles/${vehicleId}/trip`, body),
};
