import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { VehicleResponseDto } from './dtos/vehicle-response.dto';
import { VehicleSummaryDto } from './dtos/vehicle-summary.dto';

@Injectable()
export class VehiclesService {
  constructor(private prismaService: PrismaService) {}

  async createVehicle(vehicleDto: CreateVehicleDto): Promise<VehicleResponseDto> {
    const { name, licensePlate } = vehicleDto;
    try {
      return await this.prismaService.vehicle.create({
        data: { name, licensePlate },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error?.code === 'P2002') {
        throw new BadRequestException(`Licence plate '${licensePlate}' is already registered.`);
      }
      throw error;
    }
  }

  async listVehicles(): Promise<VehicleResponseDto[]> {
    return this.prismaService.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getVehicleByLicensePlate(licensePlate: string): Promise<VehicleResponseDto> {
    const vehicle = await this.prismaService.vehicle.findUnique({ where: { licensePlate } });

    if (!vehicle) throw new NotFoundException(`Vehicle with plate '${licensePlate}' not found.`);
    return vehicle;
  }

  async findVehicleByLicensePlate(licensePlate: string): Promise<VehicleResponseDto | null> {
    return this.prismaService.vehicle.findUnique({ where: { licensePlate } });
  }

  async getVehicleSummary(licensePlate: string): Promise<VehicleSummaryDto> {
    const vehicle = await this.getVehicleByLicensePlate(licensePlate);

    const [tripCount, aggregates] = await Promise.all([
      this.prismaService.trip.count({ where: { vehicleId: vehicle.id } }),
      this.prismaService.trip.aggregate({
        where: { vehicleId: vehicle.id },
        _sum: { distanceKm: true, fuelConsumed: true },
        _avg: { durationMinutes: true },
      }),
    ]);

    return {
      vehicle,
      tripCount,
      totalDistanceKm: aggregates._sum.distanceKm?.toNumber() ?? 0,
      totalFuelConsumed: aggregates._sum.fuelConsumed?.toNumber() ?? 0,
      averageDurationMinutes: Math.round(aggregates._avg.durationMinutes ?? 0),
    };
  }
}
