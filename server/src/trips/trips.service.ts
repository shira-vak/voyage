import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Trip } from '@prisma/client';
import type { PaginatedResult } from '../common/types';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateTripDto } from './dtos/create-trip.dto';
import { ListTripsQueryDto } from './dtos/list-trips-query.dto';

@Injectable()
export class TripsService {
  constructor(
    private prismaService: PrismaService,
    private vehiclesService: VehiclesService,
  ) {}

  async createTrip(vehicleId: string, dto: CreateTripDto): Promise<Trip> {
    await this.vehiclesService.getVehicleById(vehicleId);

    const startedAt = new Date(dto.startedAt);
    const endedAt = new Date(dto.endedAt);

    if (startedAt >= endedAt) {
      throw new BadRequestException('startedAt must be before endedAt');
    }

    const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);

    return this.prismaService.trip.create({
      data: {
        vehicleId,
        startedAt,
        endedAt,
        durationMinutes,
        distanceKm: dto.distanceKm,
        fuelConsumed: dto.fuelConsumed,
      },
    });
  }

  async listTrips(query: ListTripsQueryDto): Promise<PaginatedResult<Trip>> {
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

    const [data, total] = await Promise.all([
      this.prismaService.trip.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.trip.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}
