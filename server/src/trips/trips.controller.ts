import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { Trip } from '@prisma/client';
import type { PaginatedResult } from './types';
import { CreateTripDto } from './dtos/create-trip.dto';
import { ListTripsQueryDto } from './dtos/list-trips-query.dto';
import { VehicleIdDto } from './dtos/vehicle-id.dto';
import { TripsService } from './trips.service';

@Controller()
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post('vehicles/:vehicleId/trips')
  @ApiOperation({ summary: 'Record a new trip for a vehicle' })
  @ApiParam({ name: 'vehicleId' })
  async createTrip(@Param() params: VehicleIdDto, @Body() body: CreateTripDto): Promise<Trip> {
    return this.tripsService.createTrip(params.vehicleId, body);
  }

  @Get('trips')
  @ApiOperation({ summary: 'List trips with optional filters and pagination' })
  async listTrips(@Query() query: ListTripsQueryDto): Promise<PaginatedResult<Trip>> {
    return this.tripsService.listTrips(query);
  }
}
