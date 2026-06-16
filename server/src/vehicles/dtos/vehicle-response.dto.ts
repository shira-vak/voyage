import { ApiProperty } from '@nestjs/swagger';
import { CreateVehicleDto } from './create-vehicle.dto';

export class VehicleResponseDto extends CreateVehicleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;
}
