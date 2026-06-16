import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsPositive } from 'class-validator';

export class CreateTripDto {
  @IsDateString()
  @ApiProperty({ description: 'Trip start time (ISO 8601)', example: '2024-06-01T08:00:00Z' })
  startedAt: string;

  @IsDateString()
  @ApiProperty({ description: 'Trip end time (ISO 8601)', example: '2024-06-01T09:30:00Z' })
  endedAt: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Distance covered in kilometres', example: 145.5 })
  distanceKm: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Fuel or energy consumed (litres / kWh)', example: 18.3 })
  fuelConsumed: number;
}
