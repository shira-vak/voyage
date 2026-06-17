import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VehicleLicensePlateDto {
  @IsString()
  @ApiProperty({ description: 'Vehicle license plate' })
  licensePlate: string;
}
