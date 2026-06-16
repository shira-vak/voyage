import { ApiProperty } from '@nestjs/swagger';
import { TripResponseDto } from './trip-response.dto';

export class PaginatedTripsDto {
  @ApiProperty({ type: [TripResponseDto] })
  data: TripResponseDto[];

  @ApiProperty()
  totalTrips: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
