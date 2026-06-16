import { ApiProperty } from '@nestjs/swagger';
import { CreateTripDto } from './create-trip.dto';

export class TripResponseDto extends CreateTripDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vehicleId: string;

  @ApiProperty()
  durationMinutes: number;

  @ApiProperty()
  createdAt: Date;
}
