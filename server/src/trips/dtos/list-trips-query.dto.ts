import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListTripsQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Filter by vehicle license plate' })
  licensePlate?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: false,
    description: 'Return trips starting on or after this date (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: false,
    description: 'Return trips starting on or before this date (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  endDate?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, description: 'Page number (default: 1)', example: 1 })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiProperty({ required: false, description: 'Items per page, max 100 (default: 20)', example: 20 })
  limit: number = 20;
}
