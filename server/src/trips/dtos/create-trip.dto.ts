import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsPositive } from 'class-validator';

export class CreateTripDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({ description: 'Trip start time (ISO 8601)', example: '2024-06-01T08:00:00Z' })
  startedAt: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ description: 'Trip end time (ISO 8601)', example: '2024-06-01T09:30:00Z' })
  endedAt: Date;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Distance covered in kilometres', example: 145.5 })
  distanceKm: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Fuel or energy consumed (litres / kWh)', example: 18.3 })
  fuelConsumed: number;
}
