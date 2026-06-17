export interface VehicleResponse {
  id: string;
  name: string;
  licensePlate: string;
  createdAt: string;
}

export interface TripResponse {
  tripId: string;
  vehicleId: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  distanceKm: number;
  fuelConsumed: number;
  createdAt: string;
}

export interface PaginatedTripsResponse {
  data: TripResponse[];
  totalTrips: number;
  page: number;
  limit: number;
}

export interface VehicleSummaryResponse {
  vehicle: VehicleResponse;
  tripCount: number;
  totalDistanceKm: number;
  totalFuelConsumed: number;
  averageDurationMinutes: number;
}

export interface CreateVehicleRequest {
  name: string;
  licensePlate: string;
}

export interface CreateTripRequest {
  startedAt: string;
  endedAt: string;
  distanceKm: number;
  fuelConsumed: number;
}

export interface ListTripsQuery {
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
