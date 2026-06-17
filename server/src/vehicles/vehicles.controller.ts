import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { VehicleLicensePlateDto } from './dtos/vehicle-license-plate.dto';
import { VehicleResponseDto } from './dtos/vehicle-response.dto';
import { VehicleSummaryDto } from './dtos/vehicle-summary.dto';
import { VehiclesService } from './vehicles.service';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiCreatedResponse({ type: VehicleResponseDto })
  async createVehicle(@Body() body: CreateVehicleDto): Promise<VehicleResponseDto> {
    return this.vehiclesService.createVehicle(body);
  }

  @Get()
  @ApiOperation({ summary: 'List all vehicles' })
  @ApiOkResponse({ type: [VehicleResponseDto] })
  async listVehicles(): Promise<VehicleResponseDto[]> {
    return this.vehiclesService.listVehicles();
  }

  @Get(':licensePlate')
  @ApiOperation({ summary: 'Get a vehicle by license plate' })
  @ApiParam({ name: 'licensePlate', description: 'Vehicle license plate' })
  @ApiOkResponse({ type: VehicleResponseDto })
  async getVehicleByLicensePlate(@Param() params: VehicleLicensePlateDto): Promise<VehicleResponseDto> {
    return this.vehiclesService.getVehicleByLicensePlate(params.licensePlate);
  }

  @Get(':licensePlate/summary')
  @ApiOperation({ summary: 'Get aggregated trip summary for a vehicle' })
  @ApiParam({ name: 'licensePlate', description: 'Vehicle license plate' })
  @ApiOkResponse({ type: VehicleSummaryDto })
  async getVehicleSummary(@Param() params: VehicleLicensePlateDto): Promise<VehicleSummaryDto> {
    return this.vehiclesService.getVehicleSummary(params.licensePlate);
  }
}
