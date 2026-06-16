import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateTripDto } from './dtos/create-trip.dto';
import { ListTripsQueryDto } from './dtos/list-trips-query.dto';
import { PaginatedTripsDto } from './dtos/paginated-trips.dto';
import { TripResponseDto } from './dtos/trip-response.dto';
import { VehicleIdDto } from '../vehicles/dtos/vehicle-id.dto';
import { TripsService } from './trips.service';

@Controller()
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post('vehicles/:vehicleId/trips')
  @ApiOperation({ summary: 'Record a new trip for a vehicle' })
  @ApiParam({ name: 'vehicleId' })
  async createTrip(@Param() params: VehicleIdDto, @Body() body: CreateTripDto): Promise<TripResponseDto> {
    return this.tripsService.createTrip(params.vehicleId, body);
  }

  @Get('trips')
  @ApiOperation({ summary: 'List trips with optional filters and pagination' })
  async listTrips(@Query() query: ListTripsQueryDto): Promise<PaginatedTripsDto> {
    return this.tripsService.listTrips(query);
  }
}
