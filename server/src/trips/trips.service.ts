import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateTripDto } from './dtos/create-trip.dto';
import { ListTripsQueryDto } from './dtos/list-trips-query.dto';
import { PaginatedTripsDto } from './dtos/paginated-trips.dto';
import { TripResponseDto } from './dtos/trip-response.dto';
import { toTripResponseDto } from './utils';

@Injectable()
export class TripsService {
  constructor(
    private prismaService: PrismaService,
    private vehiclesService: VehiclesService,
  ) {}

  async createTrip(licensePlate: string, tripDto: CreateTripDto): Promise<TripResponseDto> {
    const vehicle = await this.vehiclesService.getVehicleByLicensePlate(licensePlate);

    const { startedAt, endedAt, distanceKm, fuelConsumed } = tripDto;

    if (startedAt >= endedAt) {
      throw new BadRequestException('startedAt must be before endedAt');
    }

    const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);

    const trip = await this.prismaService.trip.create({
      data: {
        vehicleId: vehicle.id,
        startedAt,
        endedAt,
        durationMinutes,
        distanceKm,
        fuelConsumed,
      },
    });

    return toTripResponseDto(trip);
  }

  async listTrips(tripsQuery: ListTripsQueryDto): Promise<PaginatedTripsDto> {
    const { licensePlate, startDate, endDate, page, limit } = tripsQuery;

    let vehicleId: string | undefined;
    if (licensePlate) {
      const vehicle = await this.vehiclesService.findVehicleByLicensePlate(licensePlate);
      if (!vehicle) return { data: [], totalTrips: 0, page, limit };
      vehicleId = vehicle.id;
    }

    const where: Prisma.TripWhereInput = {
      ...(vehicleId && { vehicleId }),
      ...((startDate || endDate) && {
        startedAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      }),
    };

    const [trips, totalTrips] = await Promise.all([
      this.prismaService.trip.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.trip.count({ where }),
    ]);

    return { data: trips.map(toTripResponseDto), totalTrips, page, limit };
  }
}
