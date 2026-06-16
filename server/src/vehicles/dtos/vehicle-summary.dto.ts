import { ApiProperty } from '@nestjs/swagger';
import { VehicleResponseDto } from './vehicle-response.dto';

export class VehicleSummaryDto {
  @ApiProperty({ type: VehicleResponseDto })
  vehicle: VehicleResponseDto;

  @ApiProperty()
  tripCount: number;

  @ApiProperty()
  totalDistanceKm: number;

  @ApiProperty()
  totalFuelConsumed: number;

  @ApiProperty()
  averageDurationMinutes: number;
}
