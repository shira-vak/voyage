import { ApiProperty } from '@nestjs/swagger';

export class VehicleSummaryDto {
  @ApiProperty()
  vehicleId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  licensePlate: string;

  @ApiProperty()
  tripCount: number;

  @ApiProperty()
  totalDistanceKm: number;

  @ApiProperty()
  totalFuelConsumed: number;

  @ApiProperty()
  averageDurationMinutes: number;
}
