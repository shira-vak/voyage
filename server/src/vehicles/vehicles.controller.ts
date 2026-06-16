import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { VehicleIdDto } from './dtos/vehicle-id.dto';
import { VehicleResponseDto } from './dtos/vehicle-response.dto';
import { VehicleSummaryDto } from './dtos/vehicle-summary.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  async createVehicle(@Body() body: CreateVehicleDto): Promise<VehicleResponseDto> {
    return this.vehiclesService.createVehicle(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all vehicles' })
  async listVehicles(): Promise<VehicleResponseDto[]> {
    return this.vehiclesService.listVehicles();
  }

  @Get(':vehicleId/summary')
  @ApiOperation({ summary: 'Get aggregated trip summary for a vehicle' })
  @ApiParam({ name: 'vehicleId' })
  async getVehicleSummary(@Param() params: VehicleIdDto): Promise<VehicleSummaryDto> {
    return this.vehiclesService.getVehicleSummary(params.vehicleId);
  }
}
