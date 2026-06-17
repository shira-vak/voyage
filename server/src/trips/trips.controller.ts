import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateTripDto } from './dtos/create-trip.dto';
import { ListTripsQueryDto } from './dtos/list-trips-query.dto';
import { PaginatedTripsDto } from './dtos/paginated-trips.dto';
import { TripResponseDto } from './dtos/trip-response.dto';
import { VehicleLicensePlateDto } from '../vehicles/dtos/vehicle-license-plate.dto';
import { TripsService } from './trips.service';

@ApiTags('Trips')
@Controller()
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Post('trips/:licensePlate')
  @ApiOperation({ summary: 'Record a new trip for a vehicle' })
  @ApiParam({ name: 'licensePlate', description: 'Vehicle license plate' })
  @ApiCreatedResponse({ type: TripResponseDto })
  async createTrip(@Param() params: VehicleLicensePlateDto, @Body() body: CreateTripDto): Promise<TripResponseDto> {
    return this.tripsService.createTrip(params.licensePlate, body);
  }

  @Get('trips')
  @ApiOperation({ summary: 'List trips with optional filters and pagination' })
  @ApiOkResponse({ type: PaginatedTripsDto })
  async listTrips(@Query() query: ListTripsQueryDto): Promise<PaginatedTripsDto> {
    return this.tripsService.listTrips(query);
  }
}
