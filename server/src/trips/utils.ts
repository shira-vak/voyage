import type { Trip } from '@prisma/client';
import type { TripResponseDto } from './dtos/trip-response.dto';

export function toTripResponseDto(trip: Trip): TripResponseDto {
  return {
    id: trip.id,
    vehicleId: trip.vehicleId,
    startedAt: trip.startedAt,
    endedAt: trip.endedAt,
    durationMinutes: trip.durationMinutes,
    distanceKm: trip.distanceKm.toNumber(),
    fuelConsumed: trip.fuelConsumed.toNumber(),
    createdAt: trip.createdAt,
  };
}
