import { ApiProperty } from '@nestjs/swagger';

export class TripResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vehicleId: string;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty()
  endedAt: Date;

  @ApiProperty()
  durationMinutes: number;

  @ApiProperty()
  distanceKm: number;

  @ApiProperty()
  fuelConsumed: number;

  @ApiProperty()
  createdAt: Date;
}
