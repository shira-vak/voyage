import { api } from './client';
import type { CreateVehicleRequest, VehicleResponse, VehicleSummaryResponse } from './types';

export const vehiclesApi = {
  list: (): Promise<VehicleResponse[]> => api.get('/vehicles'),

  getById: (vehicleId: string): Promise<VehicleResponse> => api.get(`/vehicles/${vehicleId}`),

  create: (body: CreateVehicleRequest): Promise<VehicleResponse> => api.post('/vehicles', body),

  getSummary: (vehicleId: string): Promise<VehicleSummaryResponse> =>
    api.get(`/vehicles/${vehicleId}/summary`),
};
