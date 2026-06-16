import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class VehicleIdDto {
  @IsUUID()
  @ApiProperty({ description: 'Vehicle UUID' })
  vehicleId: string;
}
