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

  async createTrip(vehicleId: string, dto: CreateTripDto): Promise<TripResponseDto> {
    await this.vehiclesService.getVehicleById(vehicleId);

    const startedAt = new Date(dto.startedAt);
    const endedAt = new Date(dto.endedAt);

    if (startedAt >= endedAt) {
      throw new BadRequestException('startedAt must be before endedAt');
    }

    const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);

    const trip = await this.prismaService.trip.create({
      data: {
        vehicleId,
        startedAt,
        endedAt,
        durationMinutes,
        distanceKm: dto.distanceKm,
        fuelConsumed: dto.fuelConsumed,
      },
    });

    return toTripResponseDto(trip);
  }

  async listTrips(query: ListTripsQueryDto): Promise<PaginatedTripsDto> {
    const { vehicleId, startDate, endDate, page = 1, limit = 20 } = query;

    const where: Prisma.TripWhereInput = {
      ...(vehicleId && { vehicleId }),
      ...((startDate || endDate) && {
        startedAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      }),
    };

    const [trips, total] = await Promise.all([
      this.prismaService.trip.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.trip.count({ where }),
    ]);

    return { data: trips.map(toTripResponseDto), total, page, limit };
  }
}
