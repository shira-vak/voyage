import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Vehicle } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { VehicleResponseDto } from './dtos/vehicle-response.dto';
import { VehicleSummaryDto } from './dtos/vehicle-summary.dto';

@Injectable()
export class VehiclesService {
  constructor(private prismaService: PrismaService) {}

  async createVehicle(dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    try {
      return await this.prismaService.vehicle.create({
        data: { name: dto.name, licensePlate: dto.licensePlate },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`Licence plate '${dto.licensePlate}' is already registered.`);
      }
      throw error;
    }
  }

  async listVehicles(): Promise<VehicleResponseDto[]> {
    return this.prismaService.vehicle.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getVehicleById(vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.prismaService.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle '${vehicleId}' not found.`);
    }
    return vehicle;
  }

  async getVehicleSummary(vehicleId: string): Promise<VehicleSummaryDto> {
    const vehicle = await this.getVehicleById(vehicleId);

    const [tripCount, aggregates] = await Promise.all([
      this.prismaService.trip.count({ where: { vehicleId } }),
      this.prismaService.trip.aggregate({
        where: { vehicleId },
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
